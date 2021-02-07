import Phaser from "phaser";
import Chest from "~/classes/Chest";
import Player from "../classes/Player";
import Ui from "./Ui";

export default class Game extends Phaser.Scene {
  private player: Player;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private goldPickUpAudio: Phaser.Sound.BaseSound;
  private chests: Phaser.Physics.Arcade.Group;
  private chestPositions;
  private score = 0;
  private map;
  private tiles;
  private backgroundLayer;
  private blockedLayer;
  constructor() {
    super("Game");
  }

  init() {
    this.scene.launch("Ui");
  }

  create() {
    this.createMap();
    this.createAudio();

    this.createChests();
    this.createPlayer();
    this.addCollisions();
    this.createInputs();
  }

  update() {
    this.player.update(this.cursors);
  }

  createAudio() {
    this.goldPickUpAudio = this.sound.add("goldSound", { loop: false });
  }

  createPlayer() {
    this.player = new Player({
      scene: this,
      x: 32,
      y: 32,
      texture: "characters",
      moveSpeed: 250,
    });
  }

  createChests() {
    this.chests = this.physics.add.group();
    this.chestPositions = [
      [100, 100],
      [200, 200],
      [300, 300],
    ];
    const maximumNumberOfChests = 3;
    for (let i = 0; i < maximumNumberOfChests; i++) {
      this.spawnChest();
    }
    // this.chest.setImmovable();
  }

  spawnChest() {
    const location = this.chestPositions[
      Math.floor(Math.random() * this.chestPositions.length)
    ];
    let chest = this.chests.getFirstDead();
    if (!chest) {
      const chest = new Chest({
        scene: this,
        x: location[0],
        y: location[1],
        texture: "items",
      });
      this.chests.add(chest);
    } else {
      chest.setPosition(location[0], location[1]);
      chest.makeActive();
    }
  }

  addCollisions() {
    // @ts-ignore
    this.physics.add.overlap(
      this.player,
      this.chests,
      this.collectChest,
      undefined,
      this
    );
  }

  createInputs() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  collectChest(player, chest) {
    this.goldPickUpAudio.play();
    this.score += 10;
    this.events.emit("updateScore", this.score);
    chest.makeInactive();
    // Spawn a new chest
    this.time.delayedCall(1000, this.spawnChest, [], this);
  }

  createMap() {
    // add tilemap
    this.map = this.make.tilemap({ key: "map" });
    // add tileset image
    this.tiles = this.map.addTilesetImage(
      "background",
      "background",
      32,
      32,
      1,
      2
    );

    this.backgroundLayer = this.map.createStaticLayer(
      "background",
      this.tiles,
      0,
      0
    );
    this.backgroundLayer.setScale(2);

    this.blockedLayer = this.map.createStaticLayer("blocked", this.tiles, 0, 0);
    this.blockedLayer.setScale(2);
    this.physics.world.bounds.width = this.map.widthInPixels * 2;
    this.physics.world.bounds.height = this.map.heightInPixels * 2;
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels * 2,
      this.map.heightInPixels * 2
    );
  }
}
