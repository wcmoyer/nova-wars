class UIManager {
  constructor() {
    this.uiContainer = document.getElementById('ui-container');
    this.healthBar = null;
    this.leaderboard = null;
    this.weaponDisplay = null;
    this.outfitDisplay = null;
    this.setupUI();
  }

  setupUI() {
    // Health Bar
    const healthBarHTML = `
      <div class="hud health-bar">
        <div class="health-fill" id="health-fill"></div>
        <div class="health-text" id="health-text">100/100</div>
      </div>
    `;
    this.uiContainer.insertAdjacentHTML('beforeend', healthBarHTML);
    this.healthBar = document.getElementById('health-fill');

    // Weapon Display
    const weaponHTML = `
      <div class="hud weapon-display">
        <h4 style="margin-bottom: 10px; color: #00d4ff;">Weapons (1-5)</h4>
        <div class="weapon-item active" data-weapon="bow">🏹 Bow</div>
        <div class="weapon-item" data-weapon="sword">⚔️ Sword</div>
        <div class="weapon-item" data-weapon="staff">✨ Staff</div>
        <div class="weapon-item" data-weapon="dagger">🗡️ Dagger</div>
        <div class="weapon-item" data-weapon="hammer">🔨 Hammer</div>
      </div>
    `;
    this.uiContainer.insertAdjacentHTML('beforeend', weaponHTML);
    this.weaponDisplay = document.querySelector('.weapon-display');
    this.setupWeaponButtons();

    // Leaderboard
    const leaderboardHTML = `
      <div class="hud leaderboard">
        <div class="leaderboard-title">🏆 Leaderboard</div>
        <div id="leaderboard-entries"></div>
      </div>
    `;
    this.uiContainer.insertAdjacentHTML('beforeend', leaderboardHTML);
    this.leaderboard = document.getElementById('leaderboard-entries');

    // Outfit Selector
    const outfitHTML = `
      <div class="hud outfit-selector">
        <h4 style="margin-bottom: 10px; color: #00d4ff;">Outfits (O)</h4>
        <div class="outfit-item active" data-outfit="default" title="Default">👤</div>
        <div class="outfit-item" data-outfit="warrior" title="Warrior">⚔️</div>
        <div class="outfit-item" data-outfit="mage" title="Mage">✨</div>
        <div class="outfit-item" data-outfit="archer" title="Archer">🏹</div>
        <div class="outfit-item" data-outfit="rogue" title="Rogue">🗡️</div>
      </div>
    `;
    this.uiContainer.insertAdjacentHTML('beforeend', outfitHTML);
    this.outfitDisplay = document.querySelector('.outfit-selector');
    this.setupOutfitButtons();
  }

  setupWeaponButtons() {
    const items = this.weaponDisplay.querySelectorAll('.weapon-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const weapon = item.dataset.weapon;
        gameClient.changeWeapon(weapon);
      });
    });
  }

  setupOutfitButtons() {
    const items = this.outfitDisplay.querySelectorAll('.outfit-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const outfit = item.dataset.outfit;
        gameClient.changeOutfit(outfit);
      });
    });
  }

  updateHealth(current, max) {
    const percentage = (current / max) * 100;
    this.healthBar.style.width = percentage + '%';
    document.getElementById('health-text').textContent = `${current}/${max}`;

    // Color change based on health
    if (percentage > 50) {
      this.healthBar.style.background = 'linear-gradient(90deg, #00d4ff, #0099ff)';
    } else if (percentage > 25) {
      this.healthBar.style.background = 'linear-gradient(90deg, #ffaa00, #ff6600)';
    } else {
      this.healthBar.style.background = 'linear-gradient(90deg, #ff0000, #cc0000)';
    }
  }

  updateLeaderboard(players) {
    this.leaderboard.innerHTML = '';
    const sorted = players.sort((a, b) => b.score - a.score).slice(0, 10);
    
    sorted.forEach((player, index) => {
      const entry = document.createElement('div');
      entry.className = 'leaderboard-entry';
      entry.innerHTML = `
        <span>
          <span class="leaderboard-rank">#${index + 1}</span>
          <span>${player.username}</span>
        </span>
        <span class="leaderboard-score">${player.score}</span>
      `;
      this.leaderboard.appendChild(entry);
    });
  }

  updateSelectedWeapon(weapon) {
    const items = this.weaponDisplay.querySelectorAll('.weapon-item');
    items.forEach(item => {
      if (item.dataset.weapon === weapon) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  updateSelectedOutfit(outfit) {
    const items = this.outfitDisplay.querySelectorAll('.outfit-item');
    items.forEach(item => {
      if (item.dataset.outfit === outfit) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  showScore(position, points) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = `+${points}`;
    popup.style.left = position.x + 'px';
    popup.style.top = position.y + 'px';
    this.uiContainer.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
  }

  addAdminOutput(result) {
    const output = document.getElementById('admin-output');
    const line = document.createElement('div');
    line.className = `admin-output-line ${result.success ? '' : 'admin-output-error'}`;
    line.textContent = result.message || JSON.stringify(result);
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
    
    // Keep only last 20 lines
    while (output.children.length > 20) {
      output.removeChild(output.firstChild);
    }
  }
}

const uiManager = new UIManager();
