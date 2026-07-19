const { v4: uuidv4 } = require('uuid');

class GameServer {
  constructor(io) {
    this.io = io;
    this.arenas = new Map();
    this.projectiles = new Map();
    this.gameState = {
      time: 0,
      players: [],
      leaderboard: []
    };
    this.startGameLoop();
  }

  createArena(name, maxPlayers = 8) {
    const arena = {
      id: uuidv4(),
      name,
      maxPlayers,
      players: [],
      active: true,
      createdAt: Date.now()
    };
    this.arenas.set(arena.id, arena);
    return arena;
  }

  handlePlayerAttack(playerId, data) {
    const projectile = {
      id: uuidv4(),
      playerId,
      type: data.weaponType,
      position: data.position,
      velocity: data.velocity,
      damage: this.calculateDamage(data.weaponType),
      createdAt: Date.now()
    };
    this.projectiles.set(projectile.id, projectile);
    return projectile;
  }

  calculateDamage(weaponType) {
    const damageMap = {
      'bow': 25,
      'sword': 35,
      'staff': 40,
      'dagger': 20,
      'hammer': 45
    };
    return damageMap[weaponType] || 25;
  }

  applyHit(targetId, damage) {
    return {
      targetId,
      damage,
      timestamp: Date.now()
    };
  }

  updateLeaderboard(players) {
    return players
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((p, i) => ({ rank: i + 1, ...p }));
  }

  startGameLoop() {
    setInterval(() => {
      this.gameState.time += 1000 / 60; // 60 FPS
      this.updateProjectiles();
      this.io.emit('gameStateUpdate', this.gameState);
    }, 1000 / 60);
  }

  updateProjectiles() {
    const now = Date.now();
    for (let [id, projectile] of this.projectiles) {
      // Remove projectiles older than 10 seconds
      if (now - projectile.createdAt > 10000) {
        this.projectiles.delete(id);
      }
    }
  }

  getArena(arenaId) {
    return this.arenas.get(arenaId);
  }

  getAllArenas() {
    return Array.from(this.arenas.values());
  }
}

module.exports = GameServer;
