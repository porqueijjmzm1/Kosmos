"""Writes docs/js/settings-data.js (the website's settings list) from mod.json.

Run it from the repository root after changing settings: python3 scripts/site_settings.py
"""
import json
from pathlib import Path

GROUPS = [
    ("Buffer", "How much an early click can be held back, and when.",
     ["practice-only", "save-rate", "low-latency", "custom-ticks", "custom-wave-ticks", "per-level-settings", "cbf-sync"]),
    ("Prediction", "What the hidden ghost checks before a click goes through.",
     ["smart-prediction", "robust-saves", "full-ghost-state", "plan-next-click", "predict-through-portals",
      "predict-move-triggers", "predict-moving-objects", "avoid-moving-objects", "ignore-touching-hazards",
      "ground-horizon", "wave-horizon", "cube-late-crash", "level-memory", "more-time-death-spots"]),
    ("Orbs", "Presses made around orbs.",
     ["orb-assume-hit", "orb-try-both", "orb-align", "orb-align-ticks", "orb-align-ground", "orb-timing"]),
    ("Game modes", "Helpers for each game mode.",
     ["ship-buffer", "ship-max-delay", "ship-spam-gap", "wave-safety-margin", "wave-spam-gap", "wave-spam-streak", "wave-v46",
      "robot-smart", "spider-smart", "ufo-smart", "ball-smart", "swing-smart"]),
    ("Auto-release", "Letting go (or clicking) for you when holding would crash. Practice mode only unless you allow it.",
     ["wave-auto-release", "robot-auto-release", "dash-auto-release", "auto-release-window", "auto-click", "auto-release-normal-runs"]),
    ("Speed", "How long predictions may take, so clicks never stutter.",
     ["auto-budget", "sim-budget-ms", "no-hitch-searches", "performance-mode", "tps"]),
    ("Tools & look", "What you see while playing, and the menu.",
     ["show-path", "training-mode", "death-heatmap", "save-ding", "save-flash", "remove-watermark", "hide-menu-buttons",
      "menu-theme", "auto-update"]),
    ("Keys", "Keys that work inside a level (change them here or in Geode's keybinds popup).",
     ["bind-stage", "bind-menu", "bind-export", "bind-console", "bind-path", "bind-forget"]),
    ("Debug", "For finding problems. Logs go to the in-game console (F9).",
     ["debug-console", "drift-check", "perf-log", "death-log", "explain-inputs"]),
]

KEY_NAMES = {"Six": "6", "Seven": "7"}


def show_default(s):
    value = s.get("default")
    if s.get("type") == "bool":
        return "On" if value else "Off"
    if s.get("type") == "keybind":
        return " / ".join(KEY_NAMES.get(k, k) for k in (value or [])) or "None"
    return str(value)


def main():
    root = Path(__file__).resolve().parent.parent
    mod = json.loads((root / "mod.json").read_text(encoding="utf-8"))
    settings = mod["settings"]
    used, groups = set(), []
    for name, about, keys in GROUPS:
        items = []
        for key in keys:
            if key in settings:
                used.add(key)
                s = settings[key]
                items.append({"key": key, "name": s.get("name", key), "type": s.get("type"), "default": show_default(s),
                              "about": s.get("description", ""), "choices": s.get("one-of", [])})
        groups.append({"name": name, "about": about, "items": items})
    rest = [k for k in settings if k not in used]
    if rest:
        groups.append({"name": "Other", "about": "", "items": [
            {"key": k, "name": settings[k].get("name", k), "type": settings[k].get("type"), "default": show_default(settings[k]),
             "about": settings[k].get("description", ""), "choices": settings[k].get("one-of", [])} for k in rest]})
    data = {"version": mod["version"], "geode": mod["geode"], "gd": mod["gd"], "groups": groups}
    out = root / "docs" / "js" / "settings-data.js"
    out.write_text("// made by scripts/site_settings.py from mod.json: run it again after changing settings\n"
                   "window.KOSMOS_DATA = " + json.dumps(data, indent=1, ensure_ascii=True) + ";\n", encoding="utf-8")
    print(f"{out.relative_to(root)}: {sum(len(g['items']) for g in groups)} settings in {len(groups)} groups"
          + (f" (not grouped: {', '.join(rest)})" if rest else ""))


if __name__ == "__main__":
    main()
