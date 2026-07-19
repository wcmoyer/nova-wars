// Main game loop
let lastFrameTime = Date.now();

function gameLoop() {
  const currentTime = Date.now();
  const deltaTime = (currentTime - lastFrameTime) / 1000;
  lastFrameTime = currentTime;

  // Update input
  inputHandler.update();

  // Update game client
  gameClient.update();

  // Update renderer
  if (gameClient.localPlayer && gameClient.playerId) {
    const playerBody = gameClient.physics.getBody(gameClient.playerId);
    if (playerBody) {
      // Update player mesh
      if (!renderer.playerMeshes.has(gameClient.playerId)) {
        renderer.createPlayerMesh(gameClient.playerId, gameClient.localPlayer.character);
      }
      renderer.updatePlayerPosition(gameClient.playerId, playerBody.position);
      renderer.updateCameraFollow(playerBody.position);
      
      // Update health bar
      uiManager.updateHealth(gameClient.localPlayer.health, gameClient.localPlayer.maxHealth);
    }
  }

  // Update other players
  for (let player of gameClient.players.values()) {
    if (player.id !== gameClient.playerId) {
      const playerBody = gameClient.physics.getBody(player.id);
      if (playerBody) {
        if (!renderer.playerMeshes.has(player.id)) {
          renderer.createPlayerMesh(player.id, player.character);
        }
        renderer.updatePlayerPosition(player.id, playerBody.position);
      }
    }
  }

  // Update leaderboard
  uiManager.updateLeaderboard(gameClient.gameState.players);

  // Render
  renderer.render();

  requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);

console.log('Nova Wars loaded!');
console.log('Controls:');
console.log('WASD - Move');
console.log('SPACE - Jump');
console.log('F or Click - Attack');
console.log('1-5 - Switch Weapons');
console.log('O - Switch Outfit');
console.log('` (Backtick) - Toggle Admin Console (Admin only)');
