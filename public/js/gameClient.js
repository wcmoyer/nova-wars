class GameClient {
  constructor() {
    this.socket = io();
    this.playerId = null;
    this.username = 'Player_' + Math.floor(Math.random() * 10000);
    this.players = new Map();
    this.localPlayer = null;
    this.physics = new PhysicsEngine();
    this.gameState = {
      players: [],
      leaderboard: [],
      projectiles: []
    };
    this.isAdmin = false;
    this.setupSocketListeners();
  }

  setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.joinGame();
    });

    this.socket.on('playerJoined', (player) => {
      this.playerId = player.id;
      this.localPlayer = player;
      this.physics.addRigidBody(this.playerId, 80, 'capsule');
      console.log('Player joined:', player);
    });

    this.socket.on('playerList', (players) => {
      this.gameState.players = players;
      this.updatePlayerList(players);
    });

    this.socket.on('playerMoved', (data) => {
      if (data.playerId !== this.playerId) {
        const body = this.physics.getBody(data.playerId);
        if (body) {
          body.position = data.position;
          body.rotation = data.rotation;
          body.velocity = data.velocity;
        }
      }
    });

    this.socket.on('playerAttacked', (data) => {
      // Handle attack effects
    });

    this.socket.on('ragdollActivated', (data) => {
      if (data.playerId !== this.playerId) {
        this.physics.activateRagdoll(data.playerId);
      }
    });

    this.socket.on('gameStateUpdate', (state) => {
      this.gameState = state;
    });

    this.socket.on('adminResult', (result) => {
      console.log('Admin command result:', result);
      uiManager.addAdminOutput(result);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  joinGame() {
    const characterData = {
      name: this.username,
      outfit: 'default',
      skin: 'default'
    };
    this.socket.emit('playerJoin', {
      username: this.username,
      character: characterData
    });
  }

  movePlayer(direction, speed) {
    if (this.localPlayer && this.playerId) {
      const body = this.physics.getBody(this.playerId);
      if (body) {
        const moveForce = speed * 500;
        this.physics.applyForce(this.playerId, {
          x: direction.x * moveForce,
          y: 0,
          z: direction.z * moveForce
        });
      }
    }
  }

  jump() {
    if (this.playerId) {
      const body = this.physics.getBody(this.playerId);
      if (body && body.position.y < 0.5) {
        this.physics.applyImpulse(this.playerId, { x: 0, y: 400, z: 0 });
      }
    }
  }

  attack(weaponType) {
    if (this.playerId && this.localPlayer) {
      const body = this.physics.getBody(this.playerId);
      if (body) {
        this.socket.emit('playerAttack', {
          weaponType,
          position: body.position,
          velocity: body.velocity,
          direction: this.getForwardDirection()
        });
      }
    }
  }

  changeWeapon(weaponType) {
    if (this.localPlayer) {
      this.localPlayer.selectedWeapon = weaponType;
    }
  }

  changeOutfit(outfitId) {
    if (this.playerId) {
      this.socket.emit('playerChangeOutfit', { outfitId });
    }
  }

  getForwardDirection() {
    return { x: Math.sin(0), y: 0, z: Math.cos(0) };
  }

  updatePlayerList(players) {
    for (let player of players) {
      if (!this.players.has(player.id)) {
        this.physics.addRigidBody(player.id, 80, 'capsule');
        this.physics.setVelocity(player.id, player.velocity);
      }
      this.players.set(player.id, player);
    }
  }

  sendAdminCommand(command, args) {
    this.socket.emit('adminCommand', {
      username: this.username,
      command,
      args
    });
  }

  update() {
    this.physics.update();
    
    // Update local player position
    if (this.playerId) {
      const body = this.physics.getBody(this.playerId);
      if (body) {
        this.socket.emit('playerMove', {
          position: body.position,
          rotation: body.rotation,
          velocity: body.velocity
        });
      }
    }
  }
}

const gameClient = new GameClient();
