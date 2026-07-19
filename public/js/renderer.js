class Renderer {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    document.getElementById('game-container').appendChild(this.renderer.domElement);

    this.playerMeshes = new Map();
    this.projectileMeshes = new Map();
    this.scene.background = new THREE.Color(0x0f3460);

    this.setupLighting();
    this.setupEnvironment();
    this.camera.position.set(0, 10, 20);
    this.camera.lookAt(0, 5, 0);

    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x0099ff, 0.6);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    this.scene.add(directionalLight);

    // Point lights for atmosphere
    const pointLight1 = new THREE.PointLight(0xff0080, 0.5, 100);
    pointLight1.position.set(-30, 20, 30);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ffff, 0.5, 100);
    pointLight2.position.set(30, 20, -30);
    this.scene.add(pointLight2);
  }

  setupEnvironment() {
    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x16213e,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Arena walls (invisible collision boxes)
    const wallGeometry = new THREE.BoxGeometry(500, 50, 2);
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      roughness: 0.5,
      metalness: 0.5,
      wireframe: false
    });

    // Back wall
    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.set(0, 25, -250);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    // Front wall
    const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
    frontWall.position.set(0, 25, 250);
    frontWall.castShadow = true;
    frontWall.receiveShadow = true;
    this.scene.add(frontWall);

    // Left wall
    const leftWallGeometry = new THREE.BoxGeometry(2, 50, 500);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-250, 25, 0);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    rightWall.position.set(250, 25, 0);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);

    // Skybox
    const skyGeometry = new THREE.SphereGeometry(400, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
      color: 0x0f3460,
      side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(sky);
  }

  createPlayerMesh(playerId, character) {
    // Create a ragdoll-like character
    const group = new THREE.Group();
    group.name = `player_${playerId}`;

    // Head
    const headGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b9d,
      roughness: 0.5,
      metalness: 0.3
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.6;
    head.castShadow = true;
    head.receiveShadow = true;
    group.add(head);

    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.6, 1, 0.4);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      roughness: 0.5,
      metalness: 0.4
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Left arm
    const armGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);
    const armMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b9d,
      roughness: 0.5,
      metalness: 0.3
    });
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.5, 1, 0);
    leftArm.castShadow = true;
    leftArm.receiveShadow = true;
    group.add(leftArm);

    // Right arm
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.5, 1, 0);
    rightArm.castShadow = true;
    rightArm.receiveShadow = true;
    group.add(rightArm);

    // Left leg
    const legGeometry = new THREE.BoxGeometry(0.25, 0.8, 0.25);
    const legMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      roughness: 0.6,
      metalness: 0.2
    });
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.2, 0.2, 0);
    leftLeg.castShadow = true;
    leftLeg.receiveShadow = true;
    group.add(leftLeg);

    // Right leg
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.2, 0.2, 0);
    rightLeg.castShadow = true;
    rightLeg.receiveShadow = true;
    group.add(rightLeg);

    this.scene.add(group);
    this.playerMeshes.set(playerId, group);
    return group;
  }

  updatePlayerPosition(playerId, position, rotation) {
    const mesh = this.playerMeshes.get(playerId);
    if (mesh) {
      mesh.position.copy(position);
      if (rotation) {
        mesh.rotation.copy(rotation);
      }
    }
  }

  createProjectileMesh(projectileId, type) {
    let mesh;

    switch (type) {
      case 'bow':
        // Arrow
        const arrowGeometry = new THREE.ConeGeometry(0.1, 1, 8);
        const arrowMaterial = new THREE.MeshStandardMaterial({
          color: 0x00ff00,
          roughness: 0.4,
          metalness: 0.6
        });
        mesh = new THREE.Mesh(arrowGeometry, arrowMaterial);
        break;
      case 'staff':
        // Magic projectile
        const magicGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const magicMaterial = new THREE.MeshStandardMaterial({
          color: 0xff00ff,
          emissive: 0xff00ff,
          roughness: 0.3,
          metalness: 0.8
        });
        mesh = new THREE.Mesh(magicGeometry, magicMaterial);
        break;
      default:
        const defaultGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const defaultMaterial = new THREE.MeshStandardMaterial({
          color: 0xffff00,
          roughness: 0.5,
          metalness: 0.5
        });
        mesh = new THREE.Mesh(defaultGeometry, defaultMaterial);
    }

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    this.projectileMeshes.set(projectileId, mesh);
    return mesh;
  }

  updateProjectilePosition(projectileId, position) {
    const mesh = this.projectileMeshes.get(projectileId);
    if (mesh) {
      mesh.position.copy(position);
    }
  }

  removePlayerMesh(playerId) {
    const mesh = this.playerMeshes.get(playerId);
    if (mesh) {
      this.scene.remove(mesh);
      this.playerMeshes.delete(playerId);
    }
  }

  removeProjectileMesh(projectileId) {
    const mesh = this.projectileMeshes.get(projectileId);
    if (mesh) {
      this.scene.remove(mesh);
      this.projectileMeshes.delete(projectileId);
    }
  }

  updateCameraFollow(playerPosition) {
    const targetPos = new THREE.Vector3(
      playerPosition.x,
      playerPosition.y + 8,
      playerPosition.z + 15
    );
    this.camera.position.lerp(targetPos, 0.1);
    this.camera.lookAt(
      playerPosition.x,
      playerPosition.y + 2,
      playerPosition.z
    );
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

const renderer = new Renderer();
