class AdminManager {
  constructor() {
    this.adminPanel = document.getElementById('admin-panel');
    this.commandInput = document.getElementById('admin-command');
    this.executeButton = document.getElementById('admin-execute');
    this.setupListeners();
  }

  setupListeners() {
    this.executeButton.addEventListener('click', () => this.executeCommand());
    this.commandInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.executeCommand();
      }
    });
  }

  executeCommand() {
    const input = this.commandInput.value.trim();
    if (!input) return;

    const parts = input.split(' ');
    const command = parts[0];
    const args = {};

    // Parse different commands
    switch (command.toLowerCase()) {
      case 'kick':
        args.playerId = parts[1];
        gameClient.sendAdminCommand('kick', args);
        break;

      case 'ban':
        args.username = parts[1];
        gameClient.sendAdminCommand('ban', args);
        break;

      case 'reset':
        gameClient.sendAdminCommand('resetHealth', { playerId: parts[1] });
        break;

      case 'score':
        args.playerId = parts[1];
        args.points = parseInt(parts[2]) || 0;
        gameClient.sendAdminCommand('giveScore', args);
        break;

      case 'resetserver':
        gameClient.sendAdminCommand('resetServer', {});
        break;

      case 'stats':
        args.playerId = parts[1];
        gameClient.sendAdminCommand('getStats', args);
        break;

      case 'list':
        gameClient.sendAdminCommand('listPlayers', {});
        break;

      case 'health':
        args.playerId = parts[1];
        args.health = parseInt(parts[2]) || 100;
        gameClient.sendAdminCommand('setMaxHealth', args);
        break;

      case 'teleport':
        args.playerId = parts[1];
        args.position = {
          x: parseFloat(parts[2]) || 0,
          y: parseFloat(parts[3]) || 5,
          z: parseFloat(parts[4]) || 0
        };
        gameClient.sendAdminCommand('teleport', args);
        break;

      case 'help':
        this.showHelp();
        break;

      default:
        uiManager.addAdminOutput({
          success: false,
          message: `Unknown command: ${command}. Type 'help' for available commands.`
        });
    }

    this.commandInput.value = '';
  }

  showHelp() {
    const commands = [
      'kick <playerId> - Remove a player from the server',
      'ban <username> - Ban a player',
      'reset <playerId> - Reset player health',
      'score <playerId> <points> - Give points to a player',
      'resetserver - Reset entire server',
      'stats <playerId> - Get player statistics',
      'list - List all players',
      'health <playerId> <amount> - Set max health for player',
      'teleport <playerId> <x> <y> <z> - Teleport player to position',
      'help - Show this help message'
    ];

    uiManager.addAdminOutput({
      success: true,
      message: '=== Admin Commands ==='
    });

    commands.forEach(cmd => {
      uiManager.addAdminOutput({
        success: true,
        message: cmd
      });
    });
  }
}

const adminManager = new AdminManager();
