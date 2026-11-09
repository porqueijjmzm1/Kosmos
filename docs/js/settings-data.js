// made by scripts/site_settings.py from mod.json: run it again after changing settings
window.KOSMOS_DATA = {
 "version": "v3.6.0",
 "geode": "5.11.2",
 "gd": {
  "win": "2.2081",
  "android": "2.2081",
  "mac": "2.2081",
  "ios": "2.2081"
 },
 "groups": [
  {
   "name": "Buffer",
   "about": "How much an early click can be held back, and when.",
   "items": [
    {
     "key": "practice-only",
     "name": "Practice mode only",
     "type": "bool",
     "default": "Off",
     "about": "ON: only buffer inputs in practice mode. OFF: buffer in every run.",
     "choices": []
    },
    {
     "key": "save-rate",
     "name": "Save rate (%)",
     "type": "int",
     "default": "100",
     "about": "The chance that each save goes ahead. At 100% every click the buffer can save is saved; at 50% only about half of them, and the rest go through as you clicked them, as if the buffer were off. Applies to every kind of save (normal, orb alignment, more time at death spots). Also a slider in the menu's Buffer tab.",
     "choices": []
    },
    {
     "key": "low-latency",
     "name": "Low latency mode",
     "type": "bool",
     "default": "On",
     "about": "For players who feel the buffer as lag or delayed clicks: clicks made while a delay is waiting are not shifted after it (no chain of delayed clicks), delays are at most 1 frame, searches are capped at 3 ms (no frame hitches), and robust saves / wave margin (which can add a tick) are off. On by default, and the same in every level.",
     "choices": []
    },
    {
     "key": "custom-ticks",
     "name": "Custom stage: max delay (ticks)",
     "type": "int",
     "default": "40",
     "about": "Max delay for the CUSTOM stage (key 6), all modes except wave. 4 ticks = 1 frame at 60fps.",
     "choices": []
    },
    {
     "key": "custom-wave-ticks",
     "name": "Custom stage: max wave delay (ticks)",
     "type": "int",
     "default": "20",
     "about": "Max delay for the CUSTOM stage (key 6) while in wave.",
     "choices": []
    },
    {
     "key": "per-level-settings",
     "name": "Per-level settings",
     "type": "bool",
     "default": "Off",
     "about": "The menu switches are remembered for each level and come back when you open it again. Your stage (key 6) and low latency are the same in every level. Off by default: every level uses the same switches.",
     "choices": []
    },
    {
     "key": "cbf-sync",
     "name": "Click Between Frames sync",
     "type": "bool",
     "default": "On",
     "about": "With the Click Between Frames mod, a click lands partway through a physics tick. The prediction then starts from that exact moment, and delayed inputs land on the tick the prediction tested. Has no effect without CBF.",
     "choices": []
    }
   ]
  },
  {
   "name": "Prediction",
   "about": "What the hidden ghost checks before a click goes through.",
   "items": [
    {
     "key": "smart-prediction",
     "name": "Orb / pad / portal prediction",
     "type": "bool",
     "default": "On",
     "about": "Let the ghost use orbs, pads, gravity portals and speed portals. Turn off if you see glitches with objects.",
     "choices": []
    },
    {
     "key": "robust-saves",
     "name": "Robust saves",
     "type": "bool",
     "default": "On",
     "about": "Before a save is used, it is also tested with you slightly ahead of and behind your real position (about half a tick). Saves that only work at the exact spot are swapped for a nearby delay that survives all three, if there is one. Costs a few extra predictions per save, never per normal click.",
     "choices": []
    },
    {
     "key": "full-ghost-state",
     "name": "Full ghost state (v2.8)",
     "type": "bool",
     "default": "On",
     "about": "Copy the full player state (slopes, timers, forces, dash...) into the prediction ghost. Turn off to go back to the v2.7 ghost if predictions feel worse.",
     "choices": []
    },
    {
     "key": "plan-next-click",
     "name": "Plan two clicks ahead",
     "type": "bool",
     "default": "On",
     "about": "When a predicted run crashes into something your next click would handle (after an orb, or right after a mode portal), the ghost tries one more click (at least 24 ticks later). If that saves it, the crash isn't blamed on this click: an orb click is left alone or moved to a timing that works with your next click, and inputs before a portal aren't delayed for nothing. Turn off if saves after orbs / portals feel late.",
     "choices": []
    },
    {
     "key": "predict-through-portals",
     "name": "Predict through portals",
     "type": "bool",
     "default": "On",
     "about": "Predictions keep going through mode portals (cube, ship, ball, UFO, wave, robot, spider, swing): the hidden ghost switches mode there instead of the prediction stopping, so clicks right before a portal can be saved. The new mode's floor / ceiling isn't known to the prediction. Teleport portals move the ghost to the orange end, and after a solo portal only P1 goes on (v2.84). After a dual portal P2 appears with P1, upside down, and both go on (v2.85). Teleports with forces / redirects / gravity changes still stop it. Turn off if saves around portals look wrong.",
     "choices": []
    },
    {
     "key": "predict-move-triggers",
     "name": "Predict move triggers",
     "type": "bool",
     "default": "On",
     "about": "Spikes, blocks and orbs that a trigger ahead of you will move are predicted the way the game will move them: move triggers (offset, duration, easing), rotate triggers (spinning around their center group or in place), toggle triggers that switch a group off or on, and spawn triggers, followed through their delays to the move / rotate / toggle triggers they set off (also spawns the game already started with a delay). Moves / rotations already in progress at your click follow their real path. Plain triggers only: target / follow / aim modes and lock to player / camera aren't predicted, touch triggers only once they've fired, and spawn triggers with random delays, remaps or ordered spawning aren't followed. The mod also checks itself: when a real trigger moves something, it compares the result with what it would have predicted, and if a level's triggers keep coming out wrong it turns this off for that level (the log says so). Turn off if saves near moving parts look wrong.",
     "choices": []
    },
    {
     "key": "predict-moving-objects",
     "name": "Predict moving objects (experimental)",
     "type": "bool",
     "default": "Off",
     "about": "Spikes, saws and blocks near your path that are moving right now (move / rotate triggers) are moved along their current motion during predictions: straight lines, curved / circular paths and spinning, so saves account for where they will be. Easing (speeding up / slowing down) isn't predicted. Turn 'Don't buffer near moving objects' off when using this.",
     "choices": []
    },
    {
     "key": "avoid-moving-objects",
     "name": "Don't buffer near moving objects",
     "type": "bool",
     "default": "Off",
     "about": "Experimental. The prediction sees the level frozen at your click. If the ghost's path touches spikes or blocks that moved recently (move/rotate triggers), the input goes through untouched instead of being delayed. Can cancel good saves on levels with lots of movement.",
     "choices": []
    },
    {
     "key": "ignore-touching-hazards",
     "name": "Ignore hazards you're touching",
     "type": "bool",
     "default": "On",
     "about": "Spikes / saws that overlap you at the moment of the click while you're alive can't be what kills you (e.g. a spike the level makes follow the player, or noclip), so predictions ignore them. Fixes predictions that died on their very first tick (GRIEF's wave).",
     "choices": []
    },
    {
     "key": "ground-horizon",
     "name": "Cube / ball lookahead (ticks)",
     "type": "int",
     "default": "130",
     "about": "How far ahead the prediction looks for cube, ball and spider. A cube jump lasts about 100 ticks, so the old 48 never saw the landing. Higher = catches later hits but costs more time per click.",
     "choices": []
    },
    {
     "key": "wave-horizon",
     "name": "Wave lookahead (ticks)",
     "type": "int",
     "default": "65",
     "about": "How far ahead the wave prediction looks (mini wave uses 15 ticks less). 65 = 65 normal / 50 mini. Longer sees crashes further away but costs more time per click.",
     "choices": []
    },
    {
     "key": "cube-late-crash",
     "name": "Cube: ignore crashes after (ticks)",
     "type": "int",
     "default": "90",
     "about": "If pressing now only crashes after a normal cube / ball jump would have landed, the crash is the next obstacle's, not this click's: no delay can help, so the mod skips the search (saves time and stutter). 90 ticks = about 0.37 s. 0 = always search.",
     "choices": []
    },
    {
     "key": "level-memory",
     "name": "Level memory (learns from your runs)",
     "type": "bool",
     "default": "On",
     "about": "Remembers, per level and per spot, which delays worked, where saves ended in deaths and where you keep dying. Delays that worked before are tried first; spots where saves keep failing are left alone; orange dots in the path view mark spots where you die a lot. F11 forgets the current level.",
     "choices": []
    },
    {
     "key": "more-time-death-spots",
     "name": "More time at spots you keep dying",
     "type": "bool",
     "default": "On",
     "about": "At a spot where level memory has seen you die 2+ times, an input that is only safe if your next input comes in time (wave / ship / UFO / spider) gets the small delay that pushes the crash furthest away, so you have more time to react. Normal play elsewhere is not affected. Needs Level memory.",
     "choices": []
    }
   ]
  },
  {
   "name": "Orbs",
   "about": "Presses made around orbs.",
   "items": [
    {
     "key": "orb-assume-hit",
     "name": "Orbs: assume you click them (calculation mode)",
     "type": "bool",
     "default": "On",
     "about": "The prediction clicks every orb it touches, as if you hit it on time. Turn off if it predicts deaths for orbs you normally skip.",
     "choices": []
    },
    {
     "key": "orb-try-both",
     "name": "Orbs: also try the other choice",
     "type": "bool",
     "default": "On",
     "about": "If a prediction touches an orb and dies, run it again with the opposite orb choice (click / skip) and keep the better one, like a player who only clicks the orb when needed.",
     "choices": []
    },
    {
     "key": "orb-align",
     "name": "Orb alignment",
     "type": "bool",
     "default": "On",
     "about": "If you press a little before reaching an orb (and the press wouldn't hit it), the press is held back until you're inside the orb so it hits. Works for every mode except ship and wave. Needs 'Orb / pad / portal prediction' on.",
     "choices": []
    },
    {
     "key": "orb-align-ticks",
     "name": "Orb alignment: max delay (ticks)",
     "type": "int",
     "default": "16",
     "about": "How early a press may be and still be moved onto the orb. 16 ticks = 4 frames at 60fps.",
     "choices": []
    },
    {
     "key": "orb-align-ground",
     "name": "Orb alignment: also from the ground",
     "type": "bool",
     "default": "Off",
     "about": "Off: presses made while standing on the ground are normal jumps and never get moved onto an orb. On: a ground jump made just before an orb can be turned into an orb hit.",
     "choices": []
    },
    {
     "key": "orb-timing",
     "name": "Orb timing",
     "type": "bool",
     "default": "On",
     "about": "For orbs that only work at a specific moment inside them: a press already inside an orb that would crash is moved 1-6 ticks later in the orb if that survives, the orb timing that worked at a spot before is tried first, and predictions also try clicking later orbs 3 and 6 ticks into them.",
     "choices": []
    }
   ]
  },
  {
   "name": "Game modes",
   "about": "Helpers for each game mode.",
   "items": [
    {
     "key": "ship-buffer",
     "name": "Ship: buffer inputs",
     "type": "bool",
     "default": "On",
     "about": "Buffer ship presses and releases. A crash only counts if you couldn't have recovered (the opposite input 8 / 16 / 24 ticks before it is tried), the smallest delay that clears wins, and only very fast taps go straight through (ship spam gap). Off = ship is never touched.",
     "choices": []
    },
    {
     "key": "ship-max-delay",
     "name": "Ship: max delay (ticks)",
     "type": "int",
     "default": "4",
     "about": "Ship's own max delay, used instead of the stage (key 6). Ship has momentum, so small delays are enough and big ones feel laggy. 4 ticks = 1 frame at 60fps.",
     "choices": []
    },
    {
     "key": "ship-spam-gap",
     "name": "Ship: spam gap (ticks)",
     "type": "int",
     "default": "6",
     "about": "Ship is steered by feathering, so only taps closer together than this count as spam and go straight through. The normal spam gap (16) made almost every ship input spam, so ship was barely buffered. 4 ticks = 1 frame at 60fps.",
     "choices": []
    },
    {
     "key": "wave-safety-margin",
     "name": "Wave: safety margin",
     "type": "bool",
     "default": "On",
     "about": "When a wave save is found, use a delay with one tick of room on both sides instead of the one that only just clears the spike, so tiny differences in the real run can't clip it. Can add 1 tick (0.25f) to some saves.",
     "choices": []
    },
    {
     "key": "wave-spam-gap",
     "name": "Wave spam: max gap (ticks)",
     "type": "int",
     "default": "16",
     "about": "Presses/releases closer together than this count as spam. After enough in a row (see the next setting), wave inputs go straight to the game until you pause. 16 ticks = 4 frames at 60fps (about 7 clicks/sec). Raise it if spam still gets buffered, lower it if tight wave parts stop being buffered.",
     "choices": []
    },
    {
     "key": "wave-spam-streak",
     "name": "Wave spam: fast inputs before spam",
     "type": "int",
     "default": "3",
     "about": "How many fast presses/releases in a row it takes before spam goes straight to the game. The inputs before that are still buffered, so lower it (2) if the start of your spam feels off, raise it if quick wave zigzags stop being buffered.",
     "choices": []
    },
    {
     "key": "wave-v46",
     "name": "Wave: old v4.6 logic",
     "type": "bool",
     "default": "Off",
     "about": "Use the old v4.6 wave rules (big-gain bar, 1-tick queued opposite). Off = the cube-style wave: a crash you could still turn away from counts as safe, and the smallest delay that clears the obstacle wins.",
     "choices": []
    },
    {
     "key": "robot-smart",
     "name": "Robot: smart jumps",
     "type": "bool",
     "default": "On",
     "about": "A robot press only counts as a crash if no hold length saves it (your usual hold, then 8 holds from a tap to a full-height jump, nearest to yours first). Saves are found for presses that need a different jump height, and presses you can still control aren't delayed. Robot releases are judged the same way: a delayed release has to make the jump land safely.",
     "choices": []
    },
    {
     "key": "spider-smart",
     "name": "Spider: smart flips",
     "type": "bool",
     "default": "On",
     "about": "A spider flip counts as done once you stand on the new surface for 12 ticks, and a crash you could have avoided by flipping back counts as safe. Stops the spider from delaying flips because of obstacles that need your next click.",
     "choices": []
    },
    {
     "key": "ufo-smart",
     "name": "UFO: smart flaps",
     "type": "bool",
     "default": "On",
     "about": "A UFO crash only counts if one more flap 6 / 12 / 18 ticks before it couldn't have saved you, landing on something counts as safe, the smallest delay that works wins, and fast flapping goes straight through (spam guard). Off = UFO uses the plain rules like before.",
     "choices": []
    },
    {
     "key": "ball-smart",
     "name": "Ball: smart flips",
     "type": "bool",
     "default": "On",
     "about": "Ball flips that land after only a few ticks (tight corridors) count as landings, a flip is only called safe after rolling 8 ticks on the new surface (spikes right after the landing spot), and fast flipping goes straight through (spam guard).",
     "choices": []
    },
    {
     "key": "swing-smart",
     "name": "Swing: smart flips",
     "type": "bool",
     "default": "On",
     "about": "A swing flip counts as safe if one more flip in time would have saved it (like the UFO), and fast flipping goes straight through (spam guard).",
     "choices": []
    }
   ]
  },
  {
   "name": "Auto-release",
   "about": "Letting go (or clicking) for you when holding would crash. Practice mode only unless you allow it.",
   "items": [
    {
     "key": "wave-auto-release",
     "name": "Wave auto-release",
     "type": "bool",
     "default": "Off",
     "about": "While you hold in wave, if holding would crash within the window below and letting go clearly survives, the mod lets go for you. Your own release is then ignored. Practice mode only, unless 'Auto-release in normal runs' is on.",
     "choices": []
    },
    {
     "key": "robot-auto-release",
     "name": "Robot auto-release",
     "type": "bool",
     "default": "Off",
     "about": "While you hold a robot jump, if holding longer would crash within the auto-release window and letting go survives, the mod lets go for you. Your own release is then ignored. Practice mode only, unless 'Auto-release in normal runs' is on.",
     "choices": []
    },
    {
     "key": "dash-auto-release",
     "name": "Dash orb auto-release",
     "type": "bool",
     "default": "Off",
     "about": "While you hold a dash, if holding longer would crash within the auto-release window and letting go survives, the mod lets go for you (your own release is then ignored). Practice mode only, unless 'Auto-release in normal runs' is on.",
     "choices": []
    },
    {
     "key": "auto-release-window",
     "name": "Auto-release window (ticks)",
     "type": "int",
     "default": "6",
     "about": "Auto-release only fires when holding would crash within this many ticks. Small = lets go at the last moment. 4 ticks = 1 frame at 60fps.",
     "choices": []
    },
    {
     "key": "auto-click",
     "name": "Auto-click (clicks for you)",
     "type": "bool",
     "default": "Off",
     "about": "When you're not holding and doing nothing would crash within the auto-release window, but a click right now (with your usual hold) is fully safe, the mod clicks for you. Your own click, if it still comes, is ignored. Cube, ball, UFO, robot, spider and swing (not wave / ship). Practice mode only, unless 'Auto-release in normal runs' is on; then AUTO INPUTS ON shows on screen. Runs with this aren't legit.",
     "choices": []
    },
    {
     "key": "auto-release-normal-runs",
     "name": "Auto-release in normal runs",
     "type": "bool",
     "default": "Off",
     "about": "Let auto-release (wave / robot / dash) and auto-click also work outside practice mode. While they can act, an 'AUTO INPUTS ON' tag is shown on screen. Never use it for verified or leaderboard runs.",
     "choices": []
    }
   ]
  },
  {
   "name": "Speed",
   "about": "How long predictions may take, so clicks never stutter.",
   "items": [
    {
     "key": "auto-budget",
     "name": "Auto time budget (no stutter)",
     "type": "bool",
     "default": "On",
     "about": "All predictions in one frame share a part of that frame (about 35% on PC, 30% on phones), so clicks don't make the game stutter; a search that runs out of time goes on over the next ticks. While the game is already dropping frames, clicks get at most 4 ms. Turn off to use the time budget setting as it is (longer searches, may stutter).",
     "choices": []
    },
    {
     "key": "sim-budget-ms",
     "name": "Prediction time budget (ms)",
     "type": "float",
     "default": "8.0",
     "about": "Max time spent predicting per click. Higher = finds longer saves on big windows, but may hitch on dense levels.",
     "choices": []
    },
    {
     "key": "no-hitch-searches",
     "name": "No-hitch searches",
     "type": "bool",
     "default": "On",
     "about": "When a search runs out of time before it tried every delay, your click waits one tick and the search goes on from there with fresh time (up to 4 times), instead of giving up on the save. The delays it already tried all crashed, so waiting a tick loses nothing, and busy parts don't stutter from long searches. If it still finds no save, the click goes through then. A new input of yours meanwhile ends the search. Turn off if clicks in busy parts feel late.",
     "choices": []
    },
    {
     "key": "performance-mode",
     "name": "Performance mode",
     "type": "bool",
     "default": "Off",
     "about": "For PCs that drop frames when you click: predictions get at most 4 ms per click, no extra robustness checks, orbs are only tried with a normal click (no late-click retries), and the drift check and live path view are off. Saves can be a little less precise.",
     "choices": []
    },
    {
     "key": "tps",
     "name": "Physics TPS",
     "type": "int",
     "default": "240",
     "about": "Physics steps per second in levels. 240 is the normal game. Higher values change the physics, so runs at anything but 240 aren't legit completions. The buffer's windows scale with it automatically.",
     "choices": []
    }
   ]
  },
  {
   "name": "Tools & look",
   "about": "What you see while playing, and the menu.",
   "items": [
    {
     "key": "show-path",
     "name": "Path view on at start",
     "type": "bool",
     "default": "Off",
     "about": "Draw the predicted path in the level after each input (toggle any time with F10). Red = what the input would do right now, green = what the game actually gets, white dot = where a delayed input fires, red dot = crash. Costs two extra predictions per click while on.",
     "choices": []
    },
    {
     "key": "training-mode",
     "name": "Training mode (hints only)",
     "type": "bool",
     "default": "Off",
     "about": "The buffer still predicts every input but never delays it. When an input would have been saved, a hint shows how early you were (e.g. 'click 0.5f early'), so you learn the timing yourself.",
     "choices": []
    },
    {
     "key": "death-heatmap",
     "name": "Death heatmap",
     "type": "bool",
     "default": "On",
     "about": "Red marks on the progress bar where level memory saw you die; brighter = more deaths.",
     "choices": []
    },
    {
     "key": "save-ding",
     "name": "Ding on save",
     "type": "bool",
     "default": "On",
     "about": "Plays a short ding every time the buffer saves one of your clicks.",
     "choices": []
    },
    {
     "key": "save-flash",
     "name": "Flash when save",
     "type": "bool",
     "default": "Off",
     "about": "Flashes the screen green every time the buffer saves one of your clicks.",
     "choices": []
    },
    {
     "key": "remove-watermark",
     "name": "Remove watermark",
     "type": "bool",
     "default": "Off",
     "about": "Hide the 'CBF | stage' label shown in the bottom left of levels while the buffer is on.",
     "choices": []
    },
    {
     "key": "hide-menu-buttons",
     "name": "Hide menu buttons",
     "type": "bool",
     "default": "Off",
     "about": "Hide the Kosmos (Saturn) buttons on the main menu and the pause menu. The menu still opens with Right Shift (or the menu key). Phones without a keyboard: turn this off here to get the buttons back.",
     "choices": []
    },
    {
     "key": "menu-theme",
     "name": "Menu theme",
     "type": "string",
     "default": "Kosmos",
     "about": "The look of the in-game menu: its gradient, the moving art behind it and the accent colours. Deep space: Kosmos, Nebula, Void. Planets: Saturn, Mars, Neptune. Phenomena: Aurora, Supernova, Comet.",
     "choices": [
      "Kosmos",
      "Nebula",
      "Void",
      "Saturn",
      "Mars",
      "Neptune",
      "Aurora",
      "Supernova",
      "Comet"
     ]
    },
    {
     "key": "auto-update",
     "name": "Check for updates",
     "type": "bool",
     "default": "On",
     "about": "On game start, check the mod's GitHub releases for a newer version. If there is one, the main menu shows what's new and you choose: download it, later, or skip that version. Tools > Updates checks by hand.",
     "choices": []
    }
   ]
  },
  {
   "name": "Keys",
   "about": "Keys that work inside a level (change them here or in Geode's keybinds popup).",
   "items": [
    {
     "key": "bind-stage",
     "name": "Key: change stage",
     "type": "keybind",
     "default": "6",
     "about": "Works inside a level. Change it here or in Geode's keybinds popup.",
     "choices": []
    },
    {
     "key": "bind-menu",
     "name": "Key: open menu",
     "type": "keybind",
     "default": "7",
     "about": "Works inside a level. Change it here or in Geode's keybinds popup.",
     "choices": []
    },
    {
     "key": "bind-export",
     "name": "Key: copy console log",
     "type": "keybind",
     "default": "F8",
     "about": "Works inside a level. Change it here or in Geode's keybinds popup.",
     "choices": []
    },
    {
     "key": "bind-console",
     "name": "Key: show / hide console",
     "type": "keybind",
     "default": "F9",
     "about": "Works inside a level. Change it here or in Geode's keybinds popup.",
     "choices": []
    },
    {
     "key": "bind-path",
     "name": "Key: path view",
     "type": "keybind",
     "default": "F10",
     "about": "Works inside a level. Change it here or in Geode's keybinds popup.",
     "choices": []
    },
    {
     "key": "bind-forget",
     "name": "Key: forget this level",
     "type": "keybind",
     "default": "F11",
     "about": "Works inside a level. Change it here or in Geode's keybinds popup.",
     "choices": []
    }
   ]
  },
  {
   "name": "Debug",
   "about": "For finding problems. Logs go to the in-game console (F9).",
   "items": [
    {
     "key": "debug-console",
     "name": "Debug console window",
     "type": "bool",
     "default": "Off",
     "about": "Also open a separate Windows console with the same log as the in-game console (F9). Needs a restart.",
     "choices": []
    },
    {
     "key": "drift-check",
     "name": "Drift check (debug)",
     "type": "bool",
     "default": "Off",
     "about": "After each input, compare where the prediction said you'd go with where you actually went, and log the biggest gap in the in-game console (F9). Use it to see how precise the predictions are on a level.",
     "choices": []
    },
    {
     "key": "perf-log",
     "name": "Performance log (debug)",
     "type": "bool",
     "default": "Off",
     "about": "After each click, log in the console (F9) how long its predictions took, how many runs and ghost ticks it used, and the cost per ghost tick. Changes nothing about the decisions.",
     "choices": []
    },
    {
     "key": "death-log",
     "name": "Death log (debug)",
     "type": "bool",
     "default": "Off",
     "about": "On every 'no save', log what killed the prediction ghost (object ID, type, where it is relative to you, hitboxes). Ghost deaths in the first 3 ticks are always logged. Use it with F8 when a level predicts badly.",
     "choices": []
    },
    {
     "key": "explain-inputs",
     "name": "Explain every input (debug)",
     "type": "bool",
     "default": "Off",
     "about": "Also log the inputs that were passed straight to the game and why: safe as it is, spam guard, late-crash rule, max delay 0. Busy log; turn on to see what the mod does in a part, then use F8.",
     "choices": []
    }
   ]
  }
 ]
};
