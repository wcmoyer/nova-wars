/**
 * NOVA WARS - Authentication & Debug Module
 * Handles Sphinx/Piggy auth codes, admin console, and debug logging
 */

// ===== AUTHENTICATION SYSTEM =====
const AUTH_CODES = {
  sphinx: "100915",
  piggy: "3786"
};

const OWNER_USERNAMES = new Set(["piggy", "sphinx"]);
const adminUsers = new Set();
const verifiedUsers = new Set();

// Debug mode flag
let DEBUG_MODE = false;

function hasAdmin(user) {
  if (!user) return false;
  return adminUsers.has(user.toLowerCase());
}

function isOwnerUser(user) {
  if (!user) return false;
  return OWNER_USERNAMES.has(user.toLowerCase());
}

function isVerified(user) {
  if (!user) return false;
  return verifiedUsers.has(user.toLowerCase());
}

function isOwnerAuth(user) {
  if (!user) return false;
  const name = user.toLowerCase();
  return (name === 'sphinx' || name === 'piggy') && hasAdmin(name);
}

/**
 * Authenticate user with authorization code
 * Required for: sphinx, piggy
 */
function authenticateUser(username, authCode) {
  const username_lower = username.toLowerCase();
  
  if (!isOwnerUser(username)) {
    console.log(`ℹ️ ${username} is not an owner account. No auth required.`);
    return true;
  }

  if (!AUTH_CODES[username_lower]) {
    console.error(`❌ No auth code configured for ${username}`);
    return false;
  }

  if (authCode !== AUTH_CODES[username_lower]) {
    console.error(`❌ INVALID AUTH CODE for ${username}!`);
    showNotificationBanner(`❌ INVALID AUTH CODE for ${username}!`, true);
    return false;
  }

  adminUsers.add(username_lower);
  console.log(`✅ ${username} AUTHENTICATED! Admin privileges granted.`);
  showNotificationBanner(`✅ ${username} authenticated! Welcome back.`);
  return true;
}

/**
 * Prompt for auth code if player is Sphinx/Piggy
 */
function promptAuthIfNeeded(username) {
  if (!isOwnerUser(username)) {
    return true; // No auth needed
  }

  const authCode = prompt(`🔐 Enter authorization code for ${username}:`);
  if (authCode === null) {
    showNotificationBanner(`❌ Auth cancelled. Using guest mode.`, true);
    return false;
  }

  return authenticateUser(username, authCode);
}

// ===== DEBUG CONSOLE SYSTEM =====

function toggleAdminConsole() {
  const console_elem = document.getElementById('adminConsole');
  if (!console_elem) return;

  const isVisible = console_elem.style.display === 'flex';
  console_elem.style.display = isVisible ? 'none' : 'flex';

  if (!isVisible) {
    document.getElementById('adminInput').focus();
    console.log("🖥️ Admin console opened");
  }
}

function executeAdminCommand() {
  const input = document.getElementById('adminInput');
  if (!input || !player) return;

  const cmd = input.value.trim().toLowerCase();
  input.value = '';

  if (!hasAdmin(player.name)) {
    console.error("❌ Access denied! You must be authenticated.");
    showNotificationBanner("❌ Access denied! Admin auth required.", true);
    return;
  }

  console.log(`🔧 Executing: ${cmd}`);

  const parts = cmd.split(' ');
  const command = parts[0];
  const args = parts.slice(1);

  switch (command) {
    case 'help':
      showAdminHelp();
      break;

    case 'dodge':
      player.dodge = !player.dodge;
      showNotificationBanner(`${player.dodge ? '✅' : '❌'} Auto-Dodge: ${player.dodge}`);
      console.log(`🏃 Dodge mode: ${player.dodge}`);
      break;

    case 'aimbot':
      player.aimbot = !player.aimbot;
      showNotificationBanner(`${player.aimbot ? '✅' : '❌'} Aimbot: ${player.aimbot}`);
      console.log(`🎯 Aimbot mode: ${player.aimbot}`);
      break;

    case 'homing':
      player.homingBullets = !player.homingBullets;
      showNotificationBanner(`${player.homingBullets ? '✅' : '❌'} Homing: ${player.homingBullets}`);
      console.log(`🏹 Homing bullets: ${player.homingBullets}`);
      break;

    case 'debug':
      DEBUG_MODE = !DEBUG_MODE;
      showNotificationBanner(`${DEBUG_MODE ? '✅' : '❌'} Debug Mode: ${DEBUG_MODE}`);
      console.log(`🐛 Debug mode: ${DEBUG_MODE}`);
      break;

    case 'health':
      const healAmt = parseInt(args[0]) || 50;
      player.health = Math.min(player.maxHealth, player.health + healAmt);
      showNotificationBanner(`❤️ Healed +${healAmt} HP`);
      break;

    case 'damage':
      const dmgAmt = parseInt(args[0]) || 10;
      player.health = Math.max(0, player.health - dmgAmt);
      showNotificationBanner(`💥 Took ${dmgAmt} damage`);
      break;

    case 'weapon':
      const weaponName = args[0];
      if (WEAPONS[weaponName]) {
        player.equippedWeapon = weaponName;
        player.ammo = WEAPONS[weaponName].maxAmmo;
        showNotificationBanner(`🔫 Equipped: ${WEAPONS[weaponName].name}`);
      } else {
        showNotificationBanner(`❌ Weapon not found: ${weaponName}`, true);
      }
      break;

    case 'credits':
      const creditAmt = parseInt(args[0]) || 100;
      credits += creditAmt;
      saveProgress();
      showNotificationBanner(`💰 +${creditAmt} credits`);
      break;

    case 'blueprint':
      const bpName = args[0];
      const bpAmt = parseInt(args[1]) || 1;
      if (blueprints[bpName]) {
        blueprints[bpName].count += bpAmt;
        saveProgress();
        showNotificationBanner(`📜 +${bpAmt} ${bpName} blueprints`);
      } else {
        showNotificationBanner(`❌ Blueprint not found: ${bpName}`, true);
      }
      break;

    case 'fragment':
      const fragWeapon = args[0];
      const fragAmt = parseInt(args[1]) || 50;
      if (weaponFragments[fragWeapon]) {
        weaponFragments[fragWeapon] += fragAmt;
        saveProgress();
        showNotificationBanner(`⚙️ +${fragAmt} ${fragWeapon} fragments`);
      } else {
        showNotificationBanner(`❌ Fragment type not found: ${fragWeapon}`, true);
      }
      break;

    case 'grant':
      const grantUser = args[0];
      if (grantUser) {
        adminUsers.add(grantUser.toLowerCase());
        verifiedUsers.add(grantUser.toLowerCase());
        showNotificationBanner(`✅ Admin access granted to ${grantUser}`);
        console.log(`✅ Granted admin to ${grantUser}`);
      }
      break;

    case 'revoke':
      const revokeUser = args[0];
      if (revokeUser) {
        adminUsers.delete(revokeUser.toLowerCase());
        showNotificationBanner(`❌ Admin access revoked from ${revokeUser}`);
        console.log(`❌ Revoked admin from ${revokeUser}`);
      }
      break;

    case 'verify':
      const verifyUser = args[0];
      if (verifyUser) {
        verifiedUsers.add(verifyUser.toLowerCase());
        showNotificationBanner(`✔️ ${verifyUser} verified`);
        console.log(`✔️ Verified ${verifyUser}`);
      }
      break;

    case 'spawn':
      const spawnX = parseInt(args[0]) || canvas.width / 2;
      const spawnY = parseInt(args[1]) || canvas.height / 2;
      player.x = spawnX;
      player.y = spawnY;
      player.vy = 0;
      showNotificationBanner(`📍 Teleported to (${spawnX}, ${spawnY})`);
      break;

    case 'kill':
      player.health = 0;
      showNotificationBanner(`💀 You have been eliminated`);
      break;

    case 'clear':
      console.clear();
      showNotificationBanner(`🧹 Console cleared`);
      break;

    case 'stat':
      logPlayerStats();
      break;

    default:
      showNotificationBanner(`❌ Unknown command: ${command}. Type "help" for commands.`, true);
  }
}

function showAdminHelp() {
  const helpText = `
🔧 ADMIN COMMANDS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
help              - Show this message
dodge             - Toggle auto-dodge
aimbot            - Toggle auto-aim
homing            - Toggle homing bullets
debug             - Toggle debug mode
health [amt]      - Heal player
damage [amt]      - Damage player
weapon [name]     - Equip weapon
credits [amt]     - Add credits
blueprint [name] [amt] - Add blueprints
fragment [wep] [amt]   - Add fragments
grant [user]      - Give admin to user
revoke [user]     - Remove admin from user
verify [user]     - Mark user verified
spawn [x] [y]     - Teleport
kill              - Eliminate self
stat              - Show player stats
clear             - Clear console
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `;
  console.log(helpText);
  alert(helpText);
}

function logPlayerStats() {
  if (!player) {
    console.log("❌ No player active");
    return;
  }

  const stats = `
📊 PLAYER STATS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:       ${player.name}
Position:   (${player.x.toFixed(0)}, ${player.y.toFixed(0)})
Velocity:   (${player.vx.toFixed(2)}, ${player.vy.toFixed(2)})
Health:     ${player.health} / ${player.maxHealth}
OnGround:   ${player.onGround}
Weapon:     ${WEAPONS[player.equippedWeapon].name}
Ammo:       ${player.ammo} / ${player.maxAmmo}
Credits:    ${credits}
Kills:      ${playerKills}
Damage:     ${totalDamageDealt}
Faction:    ${playerFaction}
Admin:      ${hasAdmin(player.name) ? '✅ YES' : '❌ NO'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `;
  console.log(stats);
  alert(stats);
}

/**
 * Setup admin console input handler
 */
function setupAdminConsole() {
  const adminInput = document.getElementById('adminInput');
  if (!adminInput) return;

  adminInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      executeAdminCommand();
      e.preventDefault();
    }
    if (e.key === 'Escape') {
      toggleAdminConsole();
      e.preventDefault();
    }
  });
}

/**
 * Refresh admin UI based on player auth status
 */
function refreshAdminUI() {
  const isAdmin = player && hasAdmin(player.name);
  document.getElementById('adminBtn').style.display = isAdmin ? 'inline-block' : 'none';
  if (!isAdmin) document.getElementById('adminConsole').style.display = 'none';
  console.log(`🛡️ Admin UI refreshed: ${isAdmin ? 'VISIBLE' : 'HIDDEN'}`);
}

/**
 * Boot sequence: check for console errors
 */
function bootDiagnostics() {
  console.log(`
╔════════════════════════════════════════╗
║   NOVA WARS - BOOT DIAGNOSTICS         ║
╚════════════════════════════════════════╝
📦 Canvas:        ${canvas ? '✅ READY' : '❌ MISSING'}
📦 Context:       ${ctx ? '✅ READY' : '❌ MISSING'}
📦 WEAPONS DB:    ${Object.keys(WEAPONS).length} items
📦 Maps:          ${Object.keys(maps).length} arenas
📦 Outfits:       ${Object.keys(OUTFITS_CATALOG).length} items
📦 Skins:         ${Object.keys(SKINS_CATALOG).length} items
🎮 Resolution:    ${canvas.width}x${canvas.height}
🔐 Auth Codes:    ${Object.keys(AUTH_CODES).length} configured
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ All systems nominal. Ready for launch!
  `);
}

// Export functions for HTML
window.authenticateUser = authenticateUser;
window.promptAuthIfNeeded = promptAuthIfNeeded;
window.toggleAdminConsole = toggleAdminConsole;
window.executeAdminCommand = executeAdminCommand;
window.bootDiagnostics = bootDiagnostics;
