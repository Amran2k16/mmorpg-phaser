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
    this.moveSpeed = moveSpeed;
    scene.physics.world.enable(this);
    this.setScale(2);
    this.setCollideWorldBounds(true); // NEW
    scene.add.existing(this);
    this.scene.cameras.main.startFollow(this);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    this.setVelocity(0, 0);
    if (cursors.right.isDown) {
      this.setVelocityX(this.moveSpeed);
    } else if (cursors.left.isDown) {
      this.setVelocityX(-this.moveSpeed);
    }
    if (cursors.down.isDown) {
      this.setVelocityY(this.moveSpeed);
    } else if (cursors.up.isDown) {
      this.setVelocityY(-this.moveSpeed);
    }
  }
}
