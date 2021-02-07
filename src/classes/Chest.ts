import Phaser from "phaser";

interface constructorArgs {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
}

export default class Chest extends Phaser.Physics.Arcade.Sprite {
  coins = 10;
  constructor({ scene, x, y, texture }: constructorArgs) {
    super(scene, x, y, texture, 0);
    scene.physics.world.enable(this);
    scene.add.existing(this);
  }

  makeActive() {
    this.setActive(true);
    this.setVisible(true);
    this.body.checkCollision.none = false;
  }
  makeInactive() {
    this.setActive(false);
    this.setVisible(false);
    this.body.checkCollision.none = true;
  }
}
