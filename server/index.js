const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const GameServer = require('./gameServer');
const PlayerManager = require('./playerManager');
const AdminManager = require('./adminManager');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Initialize managers
const gameServer = new GameServer(io);
const playerManager = new PlayerManager();
const adminManager = new AdminManager();

// Admin setup - CHANGE THIS TO YOUR USERNAME
const ADMIN_USERNAME = 'wcmoyer';
adminManager.setAdmin(ADMIN_USERNAME);

// Socket connection handler
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on('playerJoin', (data) => {
    const player = playerManager.createPlayer(socket.id, data.username, data.character);
    socket.emit('playerJoined', player);
    io.emit('playerList', playerManager.getAllPlayers());
  });

  socket.on('playerMove', (data) => {
    const player = playerManager.getPlayer(socket.id);
    if (player) {
      player.position = data.position;
      player.rotation = data.rotation;
      player.velocity = data.velocity;
      socket.broadcast.emit('playerMoved', { playerId: socket.id, ...data });
    }
  });

  socket.on('playerAttack', (data) => {
    gameServer.handlePlayerAttack(socket.id, data);
    io.emit('playerAttacked', { playerId: socket.id, ...data });
  });

  socket.on('ragdollActivate', (data) => {
    io.emit('ragdollActivated', { playerId: socket.id, ...data });
  });

  socket.on('adminCommand', (data) => {
    const isAdmin = adminManager.isAdmin(data.username);
    if (isAdmin) {
      const result = adminManager.executeCommand(data.command, data.args, playerManager, gameServer);
      socket.emit('adminResult', result);
    } else {
      socket.emit('adminResult', { success: false, message: 'Unauthorized' });
    }
  });

  socket.on('disconnect', () => {
    playerManager.removePlayer(socket.id);
    io.emit('playerList', playerManager.getAllPlayers());
    console.log(`Player disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Nova Wars server running on port ${PORT}`);
});
