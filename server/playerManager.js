const { v4: uuidv4 } = require('uuid');

class PlayerManager {
  constructor() {
    this.players = new Map();
  }

  createPlayer(socketId, username, characterData) {
    const player = {
      id: socketId,
      username,
      character: characterData,
      position: { x: Math.random() * 100, y: 5, z: Math.random() * 100 },
      rotation: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      health: 100,
      maxHealth: 100,
      score: 0,
      kills: 0,
      deaths: 0,
      selectedWeapon: 'bow',
      selectedOutfit: characterData.outfit || 'default',
      isRagdoll: false,
      createdAt: Date.now()
    };
    this.players.set(socketId, player);
    return player;
  }

  getPlayer(playerId) {
    return this.players.get(playerId);
  }

  getAllPlayers() {
    return Array.from(this.players.values());
  }

  updatePlayer(playerId, updates) {
    const player = this.players.get(playerId);
    if (player) {
      Object.assign(player, updates);
      return player;
    }
    return null;
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
  }

  damagePlayer(playerId, damage) {
    const player = this.players.get(playerId);
    if (player) {
      player.health = Math.max(0, player.health - damage);
      if (player.health <= 0) {
        player.deaths++;
        player.isRagdoll = true;
        this.resetPlayerHealth(playerId);
      }
      return player;
    }
    return null;
  }

  resetPlayerHealth(playerId) {
    const player = this.players.get(playerId);
    if (player) {
      player.health = player.maxHealth;
      player.isRagdoll = false;
      player.position = { x: Math.random() * 100, y: 5, z: Math.random() * 100 };
      return player;
    }
    return null;
  }

  addKill(playerId) {
    const player = this.players.get(playerId);
    if (player) {
      player.kills++;
      player.score += 50;
      return player;
    }
    return null;
  }

  addScore(playerId, points) {
    const player = this.players.get(playerId);
    if (player) {
      player.score += points;
      return player;
    }
    return null;
  }

  changeWeapon(playerId, weaponType) {
    const player = this.players.get(playerId);
    if (player) {
      player.selectedWeapon = weaponType;
      return player;
    }
    return null;
  }

  changeOutfit(playerId, outfitId) {
    const player = this.players.get(playerId);
    if (player) {
      player.selectedOutfit = outfitId;
      return player;
    }
    return null;
  }
}

module.exports = PlayerManager;
