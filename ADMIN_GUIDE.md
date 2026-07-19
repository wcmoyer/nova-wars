# Nova Wars - Admin Commands Guide 🎮

## Quick Start

**To access the admin console:** Press the backtick key (`` ` ``) on your keyboard  
**Default Admin:** wcmoyer (you!)

---

## 🎮 GAMEPLAY CONTROLS

| Key | Action |
|-----|--------|
| **W, A, S, D** | Move forward, left, back, right |
| **SPACE** | Jump |
| **F** or **Click** | Attack with current weapon |
| **1-5** | Switch weapons (Bow, Sword, Staff, Dagger, Hammer) |
| **O** | Cycle through outfits |
| `` ` `` (Backtick) | Open/Close Admin Console |
| **Q** | Fly up (when flying is enabled) |
| **E** | Fly down (when flying is enabled) |

---

## 📋 ADMIN COMMANDS GUIDE

### **FINDING PLAYER IDs**

Before using most commands, you need a player's ID. Get it by typing:

```
list
```

This shows all players with their IDs, usernames, scores, and health. Example output:
```
id: "socket123abc", username: "Player_5678", score: 50, health: 100
```

---

## 👤 PLAYER MANAGEMENT COMMANDS

### **1. View Player Statistics**
```
stats <playerId>
```
**Example:** `stats socket123abc`

**Shows:**
- Username
- Current health
- Score
- Kills/Deaths
- Selected weapon & outfit
- Power-up status (infinite health, damage, flying, admin)

---

### **2. Reset Player Health**
```
reset <playerId>
```
**Example:** `reset socket123abc`

Restores player to full health and removes ragdoll state.

---

### **3. Set Custom Health**
```
health <playerId> <amount>
```
**Example:** `health socket123abc 200`

Sets both max health and current health to the specified amount.

---

### **4. Give Points to Player**
```
score <playerId> <points>
```
**Example:** `score socket123abc 500`

Adds the specified number of points to a player's score.

---

### **5. Teleport Player**
```
teleport <playerId> <x> <y> <z>
```
**Example:** `teleport socket123abc 50 10 75`

Moves player to specific coordinates:
- **x** = left/right position (0-100)
- **y** = height above ground (usually 5+)
- **z** = forward/backward position (0-100)

---

### **6. Kick Player**
```
kick <playerId>
```
**Example:** `kick socket123abc`

Removes player from the server immediately.

---

### **7. Ban Player**
```
ban <username>
```
**Example:** `ban Player_5678`

Permanently bans a player from the server.

---

---

## ⚡ POWER-UP COMMANDS

These commands give players super abilities! Use a player's **ID** with these commands.

### **1. Infinite Health** ❤️
```
infinitehealth <playerId> [on/off]
```
**Examples:**
- `infinitehealth socket123abc on` - Enable unlimited health
- `infinitehealth socket123abc off` - Disable unlimited health
- `infinitehealth socket123abc` - Toggle (default: on)

**Effect:** Player always stays at max health, takes no damage.

---

### **2. Infinite Damage** ⚔️
```
infinitedamage <playerId> [on/off]
```
**Examples:**
- `infinitedamage socket123abc on` - Enable massive damage
- `infinitedamage socket123abc off` - Disable
- `infinitedamage socket123abc` - Toggle

**Effect:** Every attack deals 9999 damage (instant kill).

---

### **3. Flying Mode** 🛸
```
fly <playerId> [on/off]
```
**Examples:**
- `fly socket123abc on` - Enable flying
- `fly socket123abc off` - Disable flying
- `fly socket123abc` - Toggle

**Controls when flying:**
- **Q** = Fly up
- **E** = Fly down
- **W, A, S, D** = Move horizontally (still works!)

---

### **4. God Mode** 🔥 (All Powers Combined!)
```
godmode <playerId> [on/off]
```
**Examples:**
- `godmode socket123abc on` - Activate ultimate mode
- `godmode socket123abc off` - Deactivate
- `godmode socket123abc` - Toggle

**Effect:** Grants infinite health + infinite damage + flying all at once!

---

---

## 👑 ADMIN MANAGEMENT

These commands let you give other players admin privileges so they can use admin commands too!

### **1. Grant Admin Rights**
```
grantadmin <username>
```
**Example:** `grantadmin Player_5678`

Gives a player admin privileges. They can now use all admin commands!

**⚠️ Important:** Use the player's **username** (not ID), which appears in the leaderboard.

---

### **2. Revoke Admin Rights**
```
revokeadmin <username>
```
**Example:** `revokeadmin Player_5678`

Removes admin privileges from a player. They can no longer use admin commands.

---

### **3. List All Admins**
```
listadmins
```

Shows all players who currently have admin status.

**Output example:** `Active Admins: wcmoyer, Player_5678, Player_9999`

---

---

## 🔧 SERVER MANAGEMENT

### **1. List All Players**
```
list
```

Shows all connected players with:
- Player ID
- Username
- Score
- Health
- Admin status (⭐ = admin)

---

### **2. Reset Entire Server**
```
resetserver
```

⚠️ **WARNING:** This resets EVERYTHING:
- Clears all players
- Resets all projectiles
- Returns server to default state

Use this carefully!

---

---

## 📝 COMPLETE COMMAND REFERENCE

| Command | Usage | Purpose |
|---------|-------|---------|
| `list` | `list` | View all players |
| `stats` | `stats <id>` | Get player details |
| `reset` | `reset <id>` | Restore player health |
| `health` | `health <id> <amt>` | Set max health |
| `score` | `score <id> <pts>` | Award points |
| `teleport` | `teleport <id> <x> <y> <z>` | Move player |
| `kick` | `kick <id>` | Remove player |
| `ban` | `ban <username>` | Ban player |
| `infinitehealth` | `infinitehealth <id> [on/off]` | Unlimited health |
| `infinitedamage` | `infinitedamage <id> [on/off]` | Massive damage |
| `fly` | `fly <id> [on/off]` | Enable flying |
| `godmode` | `godmode <id> [on/off]` | All powers |
| `grantadmin` | `grantadmin <username>` | Make admin |
| `revokeadmin` | `revokeadmin <username>` | Remove admin |
| `listadmins` | `listadmins` | Show all admins |
| `resetserver` | `resetserver` | Reset everything |
| `help` | `help` | Show commands |

---

## 🎯 EXAMPLE SCENARIOS

### **Scenario 1: Give yourself infinite health**

1. Press `` ` `` to open admin console
2. Type `list` to find your player ID
3. Type `infinitehealth <your_id> on`
4. Now you have unlimited health! 💪

### **Scenario 2: Give a friend flying powers**

1. Type `list` to find their player ID
2. Type `fly <their_id> on`
3. They can now press **Q** to go up and **E** to go down! 🛸

### **Scenario 3: Make another player an admin**

1. Type `grantadmin <their_username>`
2. They can now open their own admin console and use commands!
3. Later, revoke with: `revokeadmin <their_username>`

### **Scenario 4: Give yourself ultimate power**

1. Type `list` to find your player ID
2. Type `godmode <your_id> on`
3. You are now invincible, deal infinite damage, AND can fly! 🔥

### **Scenario 5: Teleport to a specific location**

1. Type `teleport <player_id> 50 15 50`
2. This moves the player to the center of the map at height 15

---

## ⚠️ IMPORTANT NOTES

- **Player IDs** are long strings (like `socket123abc`)
- **Usernames** look like `Player_5678`
- Commands are **case-insensitive** (`GODMODE`, `GodMode`, `godmode` all work)
- Use **[on/off]** to specify, or omit it to toggle
- Only **admins** can execute commands
- The **backtick key** (`` ` ``) opens the console (top-left of most keyboards)

---

## 🆘 TROUBLESHOOTING

**"Unknown command" error?**
- Check spelling
- Type `help` to see all commands

**"Player not found"?**
- Run `list` to get the correct player ID
- Make sure you're using the ID, not username (for most commands)

**Command didn't work?**
- Make sure you're admin
- Check the admin console output for error messages

**Flying doesn't work?**
- Make sure flying is enabled: `fly <id> on`
- Use **Q** (up) and **E** (down) to move vertically

---

## 🎉 Have Fun!

Now you're ready to dominate Nova Wars! Use these commands to:
- Practice with infinite health
- Test mechanics with god mode
- Help friends by giving them admin rights
- Control the server

Enjoy the game! 🎮
