# NOVA WARS - Refactored Build
## Debug & Authentication System

### 🎯 What Changed

This refactor fixes the **black space spawn issue** by:
1. ✅ **Proper modal closure** before game initialization
2. ✅ **Auth code gating** for Sphinx/Piggy
3. ✅ **Safe player spawning** with error handling
4. ✅ **Modular code structure** for debugging
5. ✅ **Comprehensive admin console** with debug commands

---

## 🔐 Authentication System

### Owner Accounts
Only **Sphinx** and **Piggy** require authorization codes:

| Username | Auth Code | Privileges |
|----------|-----------|-----------|
| `sphinx` | `100915`  | Admin + Debug + Master Weapons |
| `piggy`  | `3786`    | Admin + Debug + Master Weapons |
| *Others* | None      | Guest mode (no admin features) |

### How It Works
1. Player enters username in lobby
2. If username is **Sphinx** or **Piggy**, auth modal appears
3. Must enter correct auth code to proceed
4. Upon success: Admin console + debug features unlocked
5. Admin button `[~]` appears in HUD

---

## 🛡️ Weapon Skins Catalog

### Available Finish Skins (Credit Cost)

| Skin ID | Name | Cost | Description |
|---------|------|------|-------------|
| `default` | Default Finish | 0 | Standard tactical dark metallic finish |
| `obsidian_gold` | ✨ Obsidian Gold | 350 | Pitch-black obsidian with gold accents |
| `ruby_fade` | 🔥 Ruby Fade | 450 | Crimson metallic sheen with dark fade |
| `electric_neon` | ⚡ Electric Neon | 550 | Cyan & magenta energy pulsing |
| `void_crystal` | 🌌 Void Crystal | 650 | Ultra-deep purple crystal highlights |
| `toxic_hazard` | ☣️ Toxic Hazard | 750 | Acid green biohazard plating |
| `diamond_frost` | ❄️ Diamond Frost | 850 | Icy crystalline white reflection |
| `mastery_gold` | 👑 Gold Mastery | **EARNED** | Unlock by dealing 500 damage with any weapon |

### How to Unlock Mastery Skins
- Deal **500 total damage** with any weapon (tracked per weapon)
- Automatically unlocks **Gold Mastery** finish for that weapon
- Cannot be purchased; must be earned in combat

---

## 🔧 Admin Commands Reference

Press **`~`** (tilde) or **\`** (backtick) to open admin console.

### Command Syntax
```
[command] [arg1] [arg2] ...
```

### Available Commands

#### 🆘 Help & Info
```
help              Show all admin commands
stat              Display current player stats
clear             Clear console output
```

#### 💪 Player Enhancement
```
dodge             Toggle auto-dodge (blocks incoming bullets)
aimbot            Toggle auto-aim (aims at enemies automatically)
homing            Toggle homing bullets (projectiles track targets)
debug             Toggle debug mode (shows position/velocity on screen)
```

#### ❤️ Health & Damage
```
health [amount]   Heal player (default: 50 HP)
damage [amount]   Damage player (default: 10 HP)
kill              Eliminate self (instant death)
```

**Examples:**
```
health 100        → Heal +100 HP
damage 25         → Take 25 damage
kill              → End current life
```

#### 🔫 Weapons & Equipment
```
weapon [name]     Equip weapon by ID
```

**Weapon IDs:**
- `pistol`, `smg`, `assault`, `shotgun`, `db_shotgun`
- `sniper`, `laser`, `crossbow`, `minigun`, `plasma`
- `flame_m`, `grenade_l`, `rocket`
- `khopesh`, `flail`, `crook` (master weapons, owners only)

**Examples:**
```
weapon plasma     → Equip Plasma Cannon
weapon rocket     → Equip Rocket Launcher
weapon khopesh    → Equip Khopesh Blade (owners only)
```

#### 💰 Economy & Progression
```
credits [amount]  Add credits (default: 100)
blueprint [name] [amt]    Add blueprints
fragment [weapon] [amt]   Add weapon fragments
```

**Weapon Fragment Names:**
- `minigun`, `plasma`, `rocket`, `flame_m`, `laser`

**Blueprint Names:**
- `excalibur`, `dark_matter`, `void_suit`, `cyber_wings`

**Examples:**
```
credits 1000      → Add 1000 credits
blueprint excalibur 50    → Add 50 Excalibur blueprints
fragment laser 100        → Add 100 Laser fragments
```

#### 👥 User Management
```
grant [username]  Grant admin access to user
revoke [username] Remove admin access from user
verify [username] Mark user as verified (badge ✔)
```

**Examples:**
```
grant newadmin    → Give admin to "newadmin"
revoke spammer    → Revoke admin from "spammer"
verify trusted    → Mark "trusted" as verified
```

#### 📍 Position & Movement
```
spawn [x] [y]     Teleport to coordinates
```

**Examples:**
```
spawn 640 360     → Teleport to center of screen
spawn 0 0         → Teleport to top-left corner
```

#### 🎮 Quick Toggles
```
dodge             Toggle auto-dodge ON/OFF
aimbot            Toggle aimbot ON/OFF
homing            Toggle homing bullets ON/OFF
debug             Toggle debug visual info ON/OFF
```

---

## 📊 Debug Mode Display

When **debug mode is ON**, the following info appears on-screen:

```
Player: (X, Y)         → Player position coordinates
Vel: (VX, VY)          → Velocity (horizontal, vertical)
OnGround: true/false   → Is player standing on platform?
```

This helps diagnose:
- ❌ Player stuck in black space → Check if Y is negative or >canvas.height
- ❌ Player falling through platforms → Check OnGround status
- ❌ Movement not responding → Check if Vel updates on WASD/arrow keys

---

## 🐛 Diagnostics & Boot Sequence

On page load, the browser console shows:

```
╔════════════════════════════════════════╗
║   NOVA WARS - BOOT DIAGNOSTICS         ║
╚════════════════════════════════════════╝
📦 Canvas:        ✅ READY
📦 Context:       ✅ READY
📦 WEAPONS DB:    9 items
📦 Maps:          4 arenas
📦 Outfits:       4 items
📦 Skins:         8 items
🎮 Resolution:    [width]x[height]
🔐 Auth Codes:    2 configured
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ All systems nominal. Ready for launch!
```

---

## 🎮 How to Test the Fix

### Test 1: Normal Player (No Auth Required)
1. Open game
2. Enter username (e.g., "bob")
3. Click **LAUNCH MATCH**
4. ✅ Game starts immediately in arena
5. Press `~` for console (admin features hidden)

### Test 2: Sphinx Authentication
1. Open game
2. Enter username **"sphinx"**
3. Click **LAUNCH MATCH**
4. 🔐 Auth modal appears
5. Enter code: `100915`
6. ✅ Auth success → Game starts
7. Admin button appears in HUD
8. Press `~` for full admin console

### Test 3: Admin Commands
1. Start as Sphinx/Piggy (authenticated)
2. Press `~` to open admin console
3. Try command:
   ```
   health 50
   ```
4. ✅ Notification: "❤️ Healed +50 HP"
5. Try command:
   ```
   weapon plasma
   ```
6. ✅ Equipped Plasma Cannon
7. Try command:
   ```
   stat
   ```
8. ✅ Player stats dialog appears

### Test 4: Debug Mode
1. Open admin console
2. Enter:
   ```
   debug
   ```
3. ✅ Green text appears on-screen showing position/velocity
4. Enter:
   ```
   spawn 640 360
   ```
5. ✅ Player teleports to center, coordinates update

---

## 📁 File Structure

```
nova-wars/
├── index.html              Main entry point (refactored)
├── js/
│   ├── gameEngine.js       Player class, collision, rendering
│   └── authDebug.js        Auth system, admin console, debug
└── README.md               This file
```

### Module Dependencies
- `index.html` → `gameEngine.js` → `authDebug.js`
- All variables shared via `window.*` exports

---

## 🔒 Security Notes

⚠️ **This is for development only!**

- Auth codes are **hardcoded** (not production-safe)
- All data stored in **localStorage** (client-side only)
- No backend validation
- Admin commands bypass all restrictions

**For production, you would need:**
- Server-side auth verification
- Rate limiting on admin commands
- Persistent database
- User session management

---

## 🚀 What's Fixed

| Issue | Fix |
|-------|-----|
| 🔴 Black space spawn | Player now spawns on center platform, not void |
| 🔴 No movement | Player class properly receives input from keys[] |
| 🔴 Modals covering canvas | `closeAllModals()` runs before `isMatchActive = true` |
| 🔴 Auth not required | Sphinx/Piggy now prompt for auth code |
| 🔴 No debug info | `DEBUG_MODE` shows position/velocity/ground-state |
| 🔴 Silent failures | Console logs every initialization step |

---

## 📝 Console Commands Cheat Sheet

Copy-paste these into the admin console:

```javascript
// Heal to full
health 50

// Get laser gun
weapon laser

// Get rich
credits 1000

// Add fragments
fragment laser 100
fragment rocket 50

// Get blueprints
blueprint excalibur 30

// Enable cheats
aimbot
dodge
homing

// See everything
debug
stat

// Teleport
spawn 640 360
```

---

## 🎯 Next Steps

1. **Test** the refactored build on `refactor/debug-and-auth` branch
2. **Verify** Sphinx/Piggy auth gates work
3. **Debug** any remaining issues using console commands
4. **Merge** to `main` when stable

Enjoy the ragdoll wars! 🎮⚔️
