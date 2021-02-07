import Phaser from "phaser";
import Chest from "~/classes/Chest";
import Map from "~/classes/Map";
import GameManager from "~/gameManager/GameManager";
import Player from "../classes/Player";
import Ui from "./Ui";

export default class Game extends Phaser.Scene {
  private player: Player;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private goldPickUpAudio: Phaser.Sound.BaseSound;
  private chests: Phaser.Physics.Arcade.Group;
  private chestPositions;
  private score = 0;
  private map: Map;
  private gameManager: GameManager;
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

    this.createInputs();
    this.createGameManager();
  }

  update() {
    if (this.player) this.player.update(this.cursors);
  }

  createAudio() {
    this.goldPickUpAudio = this.sound.add("goldSound", { loop: false });
  }

  createPlayer(location) {
    this.player = new Player({
      scene: this,
      x: location[0] * 2,
      y: location[1] * 2,
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
    this.physics.add.collider(this.player, this.map.blockedLayer);
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
    this.map = new Map(this, "map", "background", "background", "blocked");
  }

  createGameManager() {
    this.events.on("spawnPlayer", (location) => {
      this.createPlayer(location);
      this.addCollisions();
    });
    this.gameManager = new GameManager(this, this.map.map.objects);
    this.gameManager.setup();
  }
}
