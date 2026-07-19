class InputHandler {
  constructor() {
    this.keys = {};
    this.mouseX = 0;
    this.mouseY = 0;
    this.weaponIndex = 0;
    this.weapons = ['bow', 'sword', 'staff', 'dagger', 'hammer'];
    this.outfitIndex = 0;
    this.outfits = ['default', 'warrior', 'mage', 'archer', 'rogue'];
    this.setupKeyboard();
    this.setupMouse();
    this.setupGamepad();
  }

  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;

      // Admin console toggle
      if (e.key === '`' || e.key === '~') {
        const adminPanel = document.getElementById('admin-panel');
        adminPanel.classList.toggle('hidden');
        const input = document.getElementById('admin-command');
        if (!adminPanel.classList.contains('hidden')) {
          input.focus();
        }
      }

      // Weapon switching
      if (e.key >= '1' && e.key <= '5') {
        const index = parseInt(e.key) - 1;
        if (index < this.weapons.length) {
          this.weaponIndex = index;
          gameClient.changeWeapon(this.weapons[this.weaponIndex]);
          uiManager.updateSelectedWeapon(this.weapons[this.weaponIndex]);
        }
      }

      // Outfit switching
      if (e.key.toLowerCase() === 'o') {
        this.outfitIndex = (this.outfitIndex + 1) % this.outfits.length;
        gameClient.changeOutfit(this.outfits[this.outfitIndex]);
        uiManager.updateSelectedOutfit(this.outfits[this.outfitIndex]);
      }

      // Jump
      if (e.key === ' ') {
        e.preventDefault();
        gameClient.jump();
      }

      // Attack
      if (e.key === 'f' || e.key === 'F') {
        gameClient.attack(this.weapons[this.weaponIndex]);
      }
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  setupMouse() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    document.addEventListener('mousedown', (e) => {
      if (e.button === 0) { // Left click
        gameClient.attack(this.weapons[this.weaponIndex]);
      }
    });
  }

  setupGamepad() {
    // Gamepad support for future use
    window.addEventListener('gamepadconnected', (e) => {
      console.log('Gamepad connected:', e.gamepad);
    });
  }

  update() {
    const direction = { x: 0, y: 0, z: 0 };
    const speed = 1;

    // WASD movement
    if (this.keys['w']) direction.z -= speed;
    if (this.keys['s']) direction.z += speed;
    if (this.keys['a']) direction.x -= speed;
    if (this.keys['d']) direction.x += speed;

    if (direction.x !== 0 || direction.z !== 0) {
      gameClient.movePlayer(direction, 1);
    }
  }

  getCurrentWeapon() {
    return this.weapons[this.weaponIndex];
  }

  getCurrentOutfit() {
    return this.outfits[this.outfitIndex];
  }
}

const inputHandler = new InputHandler();
