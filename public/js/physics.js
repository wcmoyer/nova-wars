class PhysicsEngine {
  constructor() {
    this.gravity = { x: 0, y: -9.81, z: 0 };
    this.bodies = new Map();
    this.constraints = [];
    this.timeStep = 1 / 60;
  }

  addRigidBody(id, mass, shape) {
    const body = {
      id,
      mass,
      shape,
      position: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      acceleration: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      angularVelocity: { x: 0, y: 0, z: 0 },
      forces: { x: 0, y: 0, z: 0 },
      torques: { x: 0, y: 0, z: 0 },
      isKinematic: false,
      constraints: []
    };
    this.bodies.set(id, body);
    return body;
  }

  applyForce(bodyId, force) {
    const body = this.bodies.get(bodyId);
    if (body && body.mass > 0) {
      body.forces.x += force.x;
      body.forces.y += force.y;
      body.forces.z += force.z;
    }
  }

  applyImpulse(bodyId, impulse) {
    const body = this.bodies.get(bodyId);
    if (body && body.mass > 0) {
      body.velocity.x += impulse.x / body.mass;
      body.velocity.y += impulse.y / body.mass;
      body.velocity.z += impulse.z / body.mass;
    }
  }

  setVelocity(bodyId, velocity) {
    const body = this.bodies.get(bodyId);
    if (body) {
      body.velocity = { ...velocity };
    }
  }

  update() {
    // Apply gravity
    for (let body of this.bodies.values()) {
      if (!body.isKinematic) {
        body.forces.y += body.mass * this.gravity.y;
      }
    }

    // Update velocities
    for (let body of this.bodies.values()) {
      if (body.mass > 0) {
        body.acceleration.x = body.forces.x / body.mass;
        body.acceleration.y = body.forces.y / body.mass;
        body.acceleration.z = body.forces.z / body.mass;
      }

      body.velocity.x += body.acceleration.x * this.timeStep;
      body.velocity.y += body.acceleration.y * this.timeStep;
      body.velocity.z += body.acceleration.z * this.timeStep;

      // Apply damping
      body.velocity.x *= 0.99;
      body.velocity.z *= 0.99;
      body.velocity.y *= 0.999;
    }

    // Update positions
    for (let body of this.bodies.values()) {
      if (!body.isKinematic) {
        body.position.x += body.velocity.x * this.timeStep;
        body.position.y += body.velocity.y * this.timeStep;
        body.position.z += body.velocity.z * this.timeStep;
      }
    }

    // Clear forces
    for (let body of this.bodies.values()) {
      body.forces = { x: 0, y: 0, z: 0 };
      body.torques = { x: 0, y: 0, z: 0 };
    }

    // Handle ground collision
    this.handleGroundCollision();
  }

  handleGroundCollision() {
    for (let body of this.bodies.values()) {
      if (body.position.y < 0) {
        body.position.y = 0;
        body.velocity.y *= -0.6; // Bounce
        
        // Friction
        body.velocity.x *= 0.8;
        body.velocity.z *= 0.8;
      }
    }
  }

  getBody(bodyId) {
    return this.bodies.get(bodyId);
  }

  activateRagdoll(bodyId) {
    const body = this.bodies.get(bodyId);
    if (body) {
      body.isKinematic = false;
      // Add random impulse
      const randomImpulse = {
        x: (Math.random() - 0.5) * 50,
        y: 100,
        z: (Math.random() - 0.5) * 50
      };
      this.applyImpulse(bodyId, randomImpulse);
      return true;
    }
    return false;
  }
}
