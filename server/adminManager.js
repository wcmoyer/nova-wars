class AdminManager {
  constructor() {
    this.admins = new Set();
  }

  setAdmin(username) {
    this.admins.add(username);
  }

  isAdmin(username) {
    return this.admins.has(username);
  }

  executeCommand(command, args, playerManager, gameServer) {
    switch (command) {
      case 'kick':
        return this.kickPlayer(args.playerId, playerManager);
      
      case 'ban':
        return this.banPlayer(args.username);
      
      case 'resetHealth':
        return this.resetPlayerHealth(args.playerId, playerManager);
      
      case 'giveScore':
        return this.giveScore(args.playerId, args.points, playerManager);
      
      case 'resetServer':
        return this.resetServer(playerManager, gameServer);
      
      case 'getStats':
        return this.getPlayerStats(args.playerId, playerManager);
      
      case 'listPlayers':
        return this.listPlayers(playerManager);
      
      case 'setMaxHealth':
        return this.setMaxHealth(args.playerId, args.health, playerManager);
      
      case 'teleport':
        return this.teleportPlayer(args.playerId, args.position, playerManager);
      
      default:
        return { success: false, message: 'Unknown command' };
    }
  }

  kickPlayer(playerId, playerManager) {
    const player = playerManager.getPlayer(playerId);
    if (player) {
      playerManager.removePlayer(playerId);
      return { success: true, message: `Kicked player: ${player.username}` };
    }
    return { success: false, message: 'Player not found' };
  }

  banPlayer(username) {
    // This would connect to a database in production
    return { success: true, message: `Banned player: ${username}` };
  }

  resetPlayerHealth(playerId, playerManager) {
    const player = playerManager.resetPlayerHealth(playerId);
    if (player) {
      return { success: true, message: `Reset health for: ${player.username}` };
    }
    return { success: false, message: 'Player not found' };
  }

  giveScore(playerId, points, playerManager) {
    const player = playerManager.addScore(playerId, points);
    if (player) {
      return { success: true, message: `Gave ${points} points to ${player.username}. New score: ${player.score}` };
    }
    return { success: false, message: 'Player not found' };
  }

  resetServer(playerManager, gameServer) {
    playerManager.players.clear();
    gameServer.projectiles.clear();
    return { success: true, message: 'Server reset successfully' };
  }

  getPlayerStats(playerId, playerManager) {
    const player = playerManager.getPlayer(playerId);
    if (player) {
      return {
        success: true,
        stats: {
          username: player.username,
          health: player.health,
          score: player.score,
          kills: player.kills,
          deaths: player.deaths,
          weapon: player.selectedWeapon,
          outfit: player.selectedOutfit
        }
      };
    }
    return { success: false, message: 'Player not found' };
  }

  listPlayers(playerManager) {
    const players = playerManager.getAllPlayers().map(p => ({
      id: p.id,
      username: p.username,
      score: p.score,
      health: p.health
    }));
    return { success: true, players };
  }

  setMaxHealth(playerId, health, playerManager) {
    const player = playerManager.getPlayer(playerId);
    if (player) {
      player.maxHealth = health;
      player.health = health;
      return { success: true, message: `Set max health to ${health} for ${player.username}` };
    }
    return { success: false, message: 'Player not found' };
  }

  teleportPlayer(playerId, position, playerManager) {
    const player = playerManager.updatePlayer(playerId, { position });
    if (player) {
      return { success: true, message: `Teleported ${player.username} to position` };
    }
    return { success: false, message: 'Player not found' };
  }
}

module.exports = AdminManager;
