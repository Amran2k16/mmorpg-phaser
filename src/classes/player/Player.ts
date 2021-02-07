import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Image {
  public scene;
  constructor(scene, x, y, key, frame) {
    super(scene, x, y, key, frame);
    this.scene = scene;
    scene.physics.world.enable(this);
    this.setImmovable(true);
    this.setScale(2);
    this.scene.add.existing(this);
  }
}
