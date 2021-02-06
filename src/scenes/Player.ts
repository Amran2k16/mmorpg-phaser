import Phaser from "phaser";

interface constructorArgs {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
  moveSpeed: number;
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private moveSpeed: number;

  constructor({ scene, x, y, texture, moveSpeed }: constructorArgs) {
    super(scene, x, y, texture, 0);
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    this.moveSpeed = moveSpeed;
    this.setCollideWorldBounds(true); // NEW
  }

  move(direction: string) {
    switch (direction) {
      case "none":
        this.setVelocity(0, 0);
        break;
      case "left":
        this.setVelocityX(-this.moveSpeed);
        break;
      case "right":
        this.setVelocityX(this.moveSpeed);
        break;
      case "up":
        this.setVelocityY(-this.moveSpeed);
        break;
      case "down":
        this.setVelocityY(this.moveSpeed);
        break;
    }
  }
}
