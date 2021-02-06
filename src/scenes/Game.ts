import Phaser, { GameObjects } from "phaser";
import Player from "./Player";

export default class Game extends Phaser.Scene {
  private player: Player;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  constructor() {
    super("hello-world");
  }

  // Once when the scene is initialised
  init() {}

  // Before screen is rendered to the screen
  preload() {
    this.load.image("button1", "assets/images/ui/blue_button01.png");

    this.load.spritesheet("items", "assets/images/items.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("characters", "assets/images/characters.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    const button = this.add.image(100, 100, "button1").setOrigin(0.5, 0.5);
    this.add.sprite(300, 100, "button1");
    this.add.image(300, 300, "items", 1);
    const wall = this.physics.add.image(500, 100, "button1");
    wall.setImmovable();
    this.player = new Player({
      scene: this,
      x: 32,
      y: 32,
      texture: "characters",
      moveSpeed: 250,
    });

    // @ts-ignore
    this.physics.add.collider(this.player, wall);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  // Capture input and move ...
  update() {
    this.player.move("none");

    if (this.cursors.left.isDown) {
      this.player.move("left");
    } else if (this.cursors.right.isDown) {
      this.player.move("right");
    } else {
      // console.log("Do nothing");
    }

    if (this.cursors.up.isDown) {
      this.player.move("up");
    } else if (this.cursors.down.isDown) {
      this.player.move("down");
    } else {
      // console.log("Do nothing");
    }
  }
}
