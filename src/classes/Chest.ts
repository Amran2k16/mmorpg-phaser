import Phaser from "phaser";

interface constructorArgs {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
  coins: number;
  id;
}

export default class Chest extends Phaser.Physics.Arcade.Image {
  public coins;
  public id;

  constructor({ scene, x, y, texture, coins, id }: constructorArgs) {
    super(scene, x, y, texture, 0);
    this.coins = coins;
    this.id = id;
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.setScale(2);
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
