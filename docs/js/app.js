// The Kosmos website: the animated sky, the live menu, the themes, the download link, the
// changelog and the settings list.
(function () {
  "use strict";

  const REPO = "porqueijjmzm1/Kosmos";
  // The Discord invite link. Put it here (like "https://discord.gg/abc123") and every Discord
  // button on the page shows up.
  const DISCORD_URL = "";

  const K = window.Kosmos;
  const DATA = window.KOSMOS_DATA || { groups: [], version: "" };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const store = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); } catch (e) { /* private mode */ }
    },
  };
  const escapeHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  K.loadSaturn("assets/saturn.png");

  // ---------- the picked theme ----------

  let theme = Math.max(0, K.THEMES.findIndex((t) => t.name === store.get("kosmos-theme")));
  const menuState = { tab: 0, stage: 2, theme, saves: 12, saveRate: 100, pointer: null, switches: {}, perMode: false, version: DATA.version, hits: [], onTheme: (i) => pickTheme(i) };

  function applyThemeColours() {
    const t = K.THEMES[theme];
    const ink = K.ink(t);
    const root = document.documentElement.style;
    const set = (name, c) => root.setProperty(name, `${c[0]} ${c[1]} ${c[2]}`);
    set("--main", t.main);
    set("--soft", t.soft);
    set("--second", t.second);
    set("--top", t.top);
    set("--bottom", t.bottom);
    set("--text", ink.text);
    set("--muted", K.mix(ink.muted, [255, 255, 255], 0.08));
    set("--dim", K.mix(ink.dim, [255, 255, 255], 0.06));
    set("--card", K.mix(t.bottom, t.top, 0.45));
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", `rgb(${t.bottom.join(",")})`);
  }

  function pickTheme(i) {
    theme = i;
    menuState.theme = i;
    store.set("kosmos-theme", K.THEMES[i].name);
    applyThemeColours();
    $$(".theme").forEach((el) => {
      const on = Number(el.dataset.index) === i;
      el.classList.toggle("on", on);
      el.setAttribute("aria-pressed", on ? "true" : "false");
    });
    drawAll();
  }

  // ---------- animated canvases ----------

  const start = performance.now();
  const now = () => (performance.now() - start) / 1000;
  const scenes = [];

  // a canvas that redraws itself `fps` times a second while it is on screen
  function scene(canvas, fps, maxDpr, draw) {
    const s = { canvas, fps, maxDpr, draw, visible: true, last: -1, w: 0, h: 0, dpr: 1 };
    s.resize = () => {
      const r = canvas.getBoundingClientRect();
      s.dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      s.w = Math.max(1, r.width);
      s.h = Math.max(1, r.height);
      const bw = Math.round(s.w * s.dpr), bh = Math.round(s.h * s.dpr);
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      s.render(now());
    };
    s.render = (time) => {
      if (!canvas.width || !s.w || !s.h) return;  // not measured yet
      const ctx = canvas.getContext("2d");
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      draw(ctx, s, reduceMotion ? 0 : time);
      s.last = time;
    };
    scenes.push(s);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => entries.forEach((e) => (s.visible = e.isIntersecting)), { rootMargin: "120px" }).observe(canvas);
    }
    return s;
  }

  function drawAll() {
    const time = now();
    scenes.forEach((s) => s.render(time));
  }

  function loop() {
    const time = now();
    for (const s of scenes) {
      if (s.visible && time - s.last >= 1 / s.fps - 0.002) s.render(time);
    }
    window.requestAnimationFrame(loop);
  }

  // the sky behind the whole page: the theme's art, dimmer
  const sky = scene($("#sky"), 30, 1.25, (ctx, s, time) => {
    const t = K.THEMES[theme];
    const p = new K.Painter(ctx, s.h, s.dpr);
    K.gradient(p, t, 0, 0, s.w, s.h, 0);
    ctx.globalAlpha = 0.6;
    K.drawDeco(p, t, [0, 0, s.w, s.h], false, time * 0.8, 0, { dot: 1.15, stars: Math.min(3.2, (s.w * s.h) / 260000) });
    ctx.globalAlpha = 1;
  });

  // the menu in the first section: tap it like the real one
  const menuCanvas = $("#menu");
  const menu = scene(menuCanvas, 60, 2, (ctx, s, time) => {
    const p = new K.Painter(ctx, K.MENU.H, (s.w * s.dpr) / K.MENU.W);
    K.drawMenu(p, menuState, time);
  });
  function menuPoint(e) {
    const r = menuCanvas.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * K.MENU.W, K.MENU.H - ((e.clientY - r.top) / r.height) * K.MENU.H];
  }
  function menuHit(e) {
    const [x, y] = menuPoint(e);
    for (let i = menuState.hits.length - 1; i >= 0; i--) {
      const h = menuState.hits[i];
      if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return h;
    }
    return null;
  }
  menuCanvas.addEventListener("click", (e) => {
    const h = menuHit(e);
    if (h) {
      menuState.pointer = menuPoint(e);  // where the tap was, for the save rate's slider
      h.action();
      menu.render(now());
    }
  });
  menuCanvas.addEventListener("mousemove", (e) => (menuCanvas.style.cursor = menuHit(e) ? "pointer" : "default"));

  // ---------- the themes section ----------

  function buildThemes() {
    const box = $("#themeGroups");
    K.GROUPS.forEach((group, gi) => {
      const wrap = document.createElement("div");
      wrap.className = "theme-group reveal";
      wrap.innerHTML = `<h3>${escapeHtml(group)}</h3><div class="theme-row"></div>`;
      const row = $(".theme-row", wrap);
      K.THEMES.forEach((t, i) => {
        if (t.group !== gi) return;
        const card = document.createElement("button");
        card.type = "button";
        card.className = "theme";
        card.dataset.index = String(i);
        card.style.setProperty("--accent", `rgb(${t.main.join(",")})`);
        card.setAttribute("aria-label", `Use the ${t.name} theme`);
        card.innerHTML = `<canvas aria-hidden="true"></canvas>
          <span class="tick"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="m5 12 5 5 9-10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>In use</span>
          <span class="info"><div><b>${escapeHtml(t.name)}</b><small>${escapeHtml(t.about)}</small></div>
          <span class="swatch"><i style="background:rgb(${t.main.join(",")})"></i><i style="background:rgb(${t.second.join(",")})"></i></span></span>`;
        card.addEventListener("click", () => pickTheme(i));
        row.appendChild(card);
        const canvas = $("canvas", card);
        scene(canvas, 30, 2, (ctx, s, time) => {
          const p = new K.Painter(ctx, 150, (s.h * s.dpr) / 150);
          const w = (150 * s.w) / s.h;
          K.gradient(p, t, 0, 0, w, 150, 0);
          K.drawDeco(p, t, [0, 0, w, 150], false, time + i * 3.7, 0);
          p.clipRound(0, 0, w, 150, 0);
          K.twinkles(p, t, w, 150, time + i);
          p.restore();
        });
      });
      box.appendChild(wrap);
    });
  }

  // ---------- downloads and releases ----------

  function cached(key, maxAge, fetcher) {
    try {
      const hit = JSON.parse(window.sessionStorage.getItem(key) || "null");
      if (hit && Date.now() - hit.at < maxAge) return Promise.resolve(hit.data);
    } catch (e) { /* no storage */ }
    return fetcher().then((data) => {
      try { window.sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data })); } catch (e) { /* no storage */ }
      return data;
    });
  }

  function getJson(url) {
    return fetch(url, { headers: { Accept: "application/vnd.github+json" } }).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    });
  }

  // a little Markdown: headings, nested lists, bold, code and links
  function markdown(src) {
    const inline = (s) => escapeHtml(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>');
    const out = [];
    const lists = [];
    let para = [];
    let gap = false;  // a blank line since the last list item
    const flush = () => {
      if (para.length) out.push(`<p>${inline(para.join(" "))}</p>`);
      para = [];
    };
    const closeLists = (depth) => {
      while (lists.length > depth) {
        out.push("</li></ul>");
        lists.pop();
      }
    };
    String(src || "").replace(/\r/g, "").split("\n").forEach((line) => {
      const head = line.match(/^#{1,6}\s+(.*)$/);
      const item = line.match(/^(\s*)[-*]\s+(.*)$/);
      if (head) {
        flush();
        closeLists(0);
        out.push(`<h4>${inline(head[1])}</h4>`);
      } else if (item) {
        flush();
        const depth = Math.floor(item[1].length / 2) + 1;
        if (depth > lists.length) {
          while (lists.length < depth) {
            out.push("<ul><li>");
            lists.push(1);
          }
        } else {
          closeLists(depth);
          out.push("</li><li>");
        }
        out.push(inline(item[2]));
      } else if (!line.trim()) {
        flush();
        gap = lists.length > 0;
        return;
      } else if (lists.length && !gap && /^\s/.test(line)) {
        out.push(" " + inline(line.trim()));  // the item goes on, on the next line
      } else {
        closeLists(0);
        para.push(line.trim());
      }
      gap = false;
    });
    flush();
    closeLists(0);
    return out.join("");
  }

  function showVersion(tag, url, size) {
    $$("[data-version]").forEach((el) => (el.textContent = tag));
    if (url) $$("[data-download]").forEach((el) => el.setAttribute("href", url));
    if (size) $$(".cta [data-download]").forEach((el) => el.setAttribute("title", `Kosmos.geode, ${(size / 1048576).toFixed(1)} MB`));
    menuState.version = tag;
  }

  function loadReleases() {
    const box = $("#releases");
    cached("kosmos-releases", 10 * 60 * 1000, () => getJson(`https://api.github.com/repos/${REPO}/releases?per_page=15`))
      .then((all) => {
        const releases = all.filter((r) => !r.draft && !r.prerelease);
        if (!releases.length) throw new Error("no releases");
        const geode = (r) => (r.assets || []).find((a) => /\.geode$/.test(a.name));
        const latest = releases[0];
        const asset = geode(latest);
        showVersion(latest.tag_name, asset && asset.browser_download_url, asset && asset.size);
        box.innerHTML = "";
        releases.slice(0, 8).forEach((r, i) => {
          const a = geode(r);
          const date = new Date(r.published_at || r.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
          const el = document.createElement("details");
          el.className = "card release";
          if (i === 0) el.open = true;
          el.innerHTML = `<summary><span class="tag">${escapeHtml(r.tag_name)}</span>${i === 0 ? '<span class="latest">Latest</span>' : ""}<span class="date">${escapeHtml(date)}</span></summary>
            <div class="body">${markdown(r.body)}${a ? `<p class="get"><a href="${escapeHtml(a.browser_download_url)}">Download ${escapeHtml(a.name)}</a></p>` : ""}</div>`;
          box.appendChild(el);
        });
        const more = document.createElement("p");
        more.className = "muted";
        more.innerHTML = `Older versions: <a href="https://github.com/${REPO}/releases">all releases</a>.`;
        box.appendChild(more);
      })
      .catch(() => {
        box.innerHTML = `<div class="card"><p class="muted" style="margin:0">Couldn't load the releases right now. See them <a href="https://github.com/${REPO}/releases">on GitHub</a>.</p></div>`;
      })
      .finally(() => menu.render(now()));
  }

  // ---------- settings ----------

  function buildSettings() {
    const box = $("#settingGroups");
    const input = $("#settingSearch");
    const count = $("#settingCount");
    const total = DATA.groups.reduce((n, g) => n + g.items.length, 0);
    const mark = (text, re) => (re ? escapeHtml(text).replace(re, "<mark>$1</mark>") : escapeHtml(text));

    function render(query) {
      const q = query.trim().toLowerCase();
      const re = q ? new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")})`, "gi") : null;
      let shown = 0;
      box.innerHTML = "";
      DATA.groups.forEach((g, gi) => {
        const items = g.items.filter((s) => !q || `${s.name} ${s.about} ${s.key} ${s.choices.join(" ")}`.toLowerCase().includes(q));
        if (!items.length) return;
        shown += items.length;
        const el = document.createElement("details");
        el.className = "sgroup";
        el.open = !!q || gi === 0;
        el.innerHTML = `<summary><b>${escapeHtml(g.name)}</b><span class="pill">${items.length}</span><small>${escapeHtml(g.about)}</small></summary>
          <ul class="slist">${items.map((s) => `<li><div><div class="sname">${mark(s.name, re)}</div><span class="sdef">Default: <em>${escapeHtml(s.default)}</em></span></div>
          <p>${mark(s.about, re)}${s.choices.length ? `<br><span class="sdef">Choices: ${escapeHtml(s.choices.join(", "))}</span>` : ""}</p></li>`).join("")}</ul>`;
        box.appendChild(el);
      });
      if (!shown) box.innerHTML = `<div class="card empty">No setting matches "${escapeHtml(query)}".</div>`;
      count.textContent = q ? `${shown} of ${total}` : `${total} settings`;
    }
    input.addEventListener("input", () => render(input.value));
    render("");
  }

  // ---------- the rest of the page ----------

  function setupPage() {
    // Discord buttons appear once the invite is set
    if (DISCORD_URL) {
      $$("[data-discord]").forEach((el) => {
        el.hidden = false;
        el.setAttribute("href", DISCORD_URL);
      });
      $$("[data-discord-inline]").forEach((el) => (el.hidden = false));
    }

    // the menu button on phones
    const toggle = $("#menuToggle");
    const links = $("#links");
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", links).forEach((a) => a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }));

    // the install tabs, starting on your platform
    const tabs = $$("[data-os]");
    const showOs = (os) => {
      tabs.forEach((b) => b.setAttribute("aria-selected", b.dataset.os === os ? "true" : "false"));
      $$("[data-os-panel]").forEach((p) => (p.hidden = p.dataset.osPanel !== os));
    };
    tabs.forEach((b) => b.addEventListener("click", () => showOs(b.dataset.os)));
    const ua = navigator.userAgent;
    // iPads say they are Macs, but Macs have no touch screen
    const ios = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
    showOs(/Android/i.test(ua) ? "android" : ios ? "ios" : /Macintosh|Mac OS X/i.test(ua) ? "mac" : "win");

    // light up the section you're reading in the top bar
    if ("IntersectionObserver" in window) {
      const navLinks = $$('.links a[href^="#"]');
      const watch = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          navLinks.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === `#${e.target.id}`));
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      $$("main section[id]").forEach((s) => watch.observe(s));

      // things fade in as they come into view
      const reveal = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            reveal.unobserve(e.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px" });
      $$(".block-head, .card, .install-steps > li, .faq details, .theme-group, .sgroup").forEach((el) => {
        el.classList.add("reveal");
        reveal.observe(el);
      });
    }
  }

  // ---------- start ----------

  applyThemeColours();
  buildThemes();
  buildSettings();
  setupPage();
  pickTheme(theme);
  scenes.forEach((s) => s.resize());
  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => scenes.forEach((s) => s.resize()), 120);
  });
  // the font and the icon arrive a moment later: draw again with them
  if (document.fonts && document.fonts.load) document.fonts.load('12px "Exo 2"').then(drawAll, drawAll);
  window.addEventListener("load", drawAll);
  loadReleases();
  if (!reduceMotion) window.requestAnimationFrame(loop);
  void sky;
})();
