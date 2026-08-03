/**
 * NOVA WARS - Game Engine Module
 * Handles Player class, collision detection, and core game loop
 */

class Player {
  constructor(x, y, name, outfit = 'default', skin = 'default') {
    this.x = x;
    this.y = y;
    this.name = name;
    this.width = 16;
    this.height = 24;
    this.vx = 0;
    this.vy = 0;
    this.health = 50;
    this.maxHealth = 50;
    this.equippedWeapon = 'pistol';
    this.equippedOutfit = outfit;
    this.equippedSkin = skin;
    
    // Physics & State
    this.onGround = false;
    this.speedMult = 1.0;
    this.invisible = false;
    this.shieldActive = false;
    this.dodge = false;
    this.aimbot = false;
    this.homingBullets = false;
    
    // Weapon state
    this.ammo = WEAPONS[this.equippedWeapon].ammo;
    this.maxAmmo = WEAPONS[this.equippedWeapon].maxAmmo;
    this.fireRate = 0;
    
    // Emote system
    this.currentEmote = null;
    this.emoteTimer = 0;
    
    console.log(`✅ Player spawned: ${name} at (${x.toFixed(0)}, ${y.toFixed(0)})`);
  }

  getAimAngle() {
    const dx = mouse.x - (canvas.width / 2);
    const dy = mouse.y - (canvas.height / 2);
    return Math.atan2(dy, dx);
  }

  update(keys, platforms) {
    // Horizontal movement
    const moveSpeed = 5 * this.speedMult;
    if (keys['ArrowLeft'] || keys['a']) this.vx = -moveSpeed;
    else if (keys['ArrowRight'] || keys['d']) this.vx = moveSpeed;
    else this.vx *= 0.85;

    // Apply gravity
    this.vy += 0.6;
    if (this.vy > 20) this.vy = 20;

    // Platform collision
    this.onGround = false;
    platforms.forEach(p => {
      // Vertical collision (standing on platform)
      if (
        this.x + this.width / 2 >= p.x &&
        this.x - this.width / 2 <= p.x + p.w &&
        this.vy >= 0 &&
        this.y + this.height / 2 <= p.y + 10
      ) {
        this.y = p.y - this.height / 2;
        this.vy = 0;
        this.onGround = true;
      }

      // Horizontal collision (walls)
      if (this.y >= p.y - this.height && this.y <= p.y + p.h) {
        if (this.vx > 0 && this.x + this.width / 2 <= p.x) {
          this.x = p.x - this.width / 2;
          this.vx = 0;
        } else if (this.vx < 0 && this.x - this.width / 2 >= p.x + p.w) {
          this.x = p.x + p.w + this.width / 2;
          this.vx = 0;
        }
      }
    });

    // Fall damage (if off platform too long)
    if (this.y > canvas.height + 100) {
      console.warn(`⚠️ ${this.name} fell off map!`);
      this.health = 0;
    }

    // Apply velocity
    this.x += this.vx;
    this.y += this.vy;

    // Jumping
    if (keys['ArrowUp'] && this.onGround) {
      this.vy = -15;
      this.onGround = false;
    }

    // Weapon fire rate
    if (this.fireRate > 0) this.fireRate--;

    // Ability cooldown
    if (abilityCooldownTimer > 0) abilityCooldownTimer--;
    if (abilityActiveTimer > 0) abilityActiveTimer--;
    else {
      this.speedMult = 1.0;
      this.invisible = false;
      this.shieldActive = false;
    }

    // Emote animation
    if (this.emoteTimer > 0) this.emoteTimer--;
  }

  shoot(angle, mouseDown) {
    if (!mouseDown || this.fireRate > 0) return;

    const wep = WEAPONS[this.equippedWeapon];
    if (this.ammo <= 0) {
      console.log("🔴 No ammo!");
      return;
    }

    this.fireRate = wep.rate;
    this.ammo--;

    const bulletX = this.x + Math.cos(angle) * 20;
    const bulletY = this.y + Math.sin(angle) * 20;

    for (let i = 0; i < wep.multishot; i++) {
      const spread = (Math.random() - 0.5) * 0.3;
      const bulletAngle = angle + spread;
      
      const bullet = {
        x: bulletX,
        y: bulletY,
        vx: Math.cos(bulletAngle) * wep.speed,
        vy: Math.sin(bulletAngle) * wep.speed,
        damage: wep.damage,
        owner: this.name,
        lifetime: 300
      };
      
      projectiles.push(bullet);
    }

    recordPlayerStats(this.name, 0, 0, wep.damage);
  }

  reload() {
    this.ammo = this.maxAmmo;
    console.log(`🔄 Reloaded: ${this.ammo}/${this.maxAmmo}`);
    showNotificationBanner(`🔄 Reloaded: ${this.ammo}/${this.maxAmmo}`);
  }

  throwBomb() {
    const angle = this.getAimAngle();
    const bombX = this.x + Math.cos(angle) * 25;
    const bombY = this.y + Math.sin(angle) * 25;

    const bomb = {
      x: bombX,
      y: bombY,
      vx: Math.cos(angle) * 12,
      vy: Math.sin(angle) * 12 - 3,
      owner: this.name,
      lifetime: 200,
      damage: 15,
      radius: 60,
      isBomb: true
    };

    projectiles.push(bomb);
    console.log(`💣 Bomb thrown by ${this.name}`);
  }

  playEmote(symbol) {
    this.currentEmote = symbol;
    this.emoteTimer = 60;
  }

  render(ctx) {
    if (this.invisible) ctx.globalAlpha = 0.3;

    // Draw body
    ctx.fillStyle = '#ff6b9d';
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

    // Draw shield effect
    if (this.shieldActive) {
      ctx.strokeStyle = '#00ffcc';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw emote
    if (this.currentEmote && this.emoteTimer > 0) {
      ctx.font = 'bold 24px Arial';
      ctx.fillText(this.currentEmote, this.x - 10, this.y - 40);
    }

    // Draw health bar
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(this.x - 10, this.y - 20, 20, 3);
    ctx.fillStyle = '#00ff66';
    ctx.fillRect(this.x - 10, this.y - 20, (20 * this.health) / this.maxHealth, 3);

    // Draw name
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, this.x, this.y + 20);

    ctx.globalAlpha = 1.0;
  }
}

// Global game state
let projectiles = [];
let allEntities = [];
let player = null;
let enemies = [];

/**
 * Initialize game after match starts
 */
function initializeGame() {
  projectiles = [];
  allEntities = [];
  enemies = [];

  const platforms = getCalculatedPlatforms();
  if (!platforms || platforms.length === 0) {
    console.error("❌ FATAL: No platforms loaded!");
    return false;
  }

  // Spawn player on center platform
  const centerPlatform = platforms[Math.floor(platforms.length / 2)];
  player = new Player(
    centerPlatform.x + centerPlatform.w / 2,
    centerPlatform.y - 40,
    playerName,
    equippedOutfit,
    equippedSkin
  );

  if (!player || !player.x || !player.y) {
    console.error("❌ FATAL: Player initialization failed!");
    return false;
  }

  allEntities.push(player);
  console.log("✅ Game initialized successfully!");
  return true;
}

/**
 * Main game update loop
 */
function updateGame() {
  if (!isMatchActive || !player) return;

  const platforms = getCalculatedPlatforms();

  // Update player
  player.update(keys, platforms);

  // Update enemies (stub for AI)
  updateEnemies(platforms);

  // Update projectiles
  projectiles = projectiles.filter(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.lifetime--;
    return p.lifetime > 0;
  });

  // Player shooting
  if (mouse.down && !isModalOpen()) {
    const angle = touchAimAngle !== null ? touchAimAngle : player.getAimAngle();
    player.shoot(angle, true);
  }

  updateHUD();
}

/**
 * Stub for enemy AI
 */
function updateEnemies(platforms) {
  // TODO: Implement AI logic
}

/**
 * Check if any modal is open
 */
function isModalOpen() {
  const modals = document.querySelectorAll('.modal');
  for (let modal of modals) {
    if (modal.style.display === 'flex' || modal.style.display === 'block') {
      return true;
    }
  }
  return false;
}

/**
 * Render game to canvas
 */
function renderGame(ctx) {
  if (!isMatchActive || !player) return;

  const mapConfig = maps[currentMap] || maps.cyber;

  // Background
  ctx.fillStyle = mapConfig.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Platforms
  const platforms = getCalculatedPlatforms();
  platforms.forEach(p => {
    // Top face (3D effect)
    ctx.fillStyle = mapConfig.top;
    ctx.fillRect(p.x, p.y, p.w, p.h);

    // Side face
    ctx.fillStyle = mapConfig.side;
    ctx.fillRect(p.x, p.y + p.h, p.w, 10);

    // Border
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.strokeRect(p.x, p.y, p.w, p.h);
  });

  // Render player
  player.render(ctx);

  // Render projectiles
  projectiles.forEach(p => {
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Debug info (if needed)
  if (DEBUG_MODE) {
    ctx.fillStyle = '#00ff00';
    ctx.font = '11px monospace';
    ctx.fillText(`Player: (${player.x.toFixed(0)}, ${player.y.toFixed(0)})`, 10, 30);
    ctx.fillText(`Vel: (${player.vx.toFixed(1)}, ${player.vy.toFixed(1)})`, 10, 45);
    ctx.fillText(`OnGround: ${player.onGround}`, 10, 60);
  }
}

/**
 * Update HUD display
 */
function updateHUD() {
  if (!player) return;

  document.getElementById('playerNameVal').innerText = player.name;
  document.getElementById('hpVal').innerText = `${Math.max(0, player.health)} / ${player.maxHealth}`;
  document.getElementById('creditsVal').innerText = credits;
  document.getElementById('weaponVal').innerText = WEAPONS[player.equippedWeapon].name;
  document.getElementById('ammoVal').innerText = `${player.ammo} / ${player.maxAmmo}`;
}
