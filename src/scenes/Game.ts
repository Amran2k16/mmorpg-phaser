import Phaser from "phaser";
import Chest from "~/classes/Chest";
import Map from "~/classes/Map";
import Monster from "~/classes/Monster";
import GameManager from "~/gameManager/GameManager";
import Player from "../classes/Player";
import Ui from "./Ui";

export default class Game extends Phaser.Scene {
  private player: Player;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private goldPickUpAudio: Phaser.Sound.BaseSound;
  private chests: Phaser.Physics.Arcade.Group;
  private monsters: Phaser.Physics.Arcade.Group;
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
    this.createGroups();

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

  createGroups() {
    this.chests = this.physics.add.group();
    this.monsters = this.physics.add.group();
  }

  spawnChest(chestObject) {
    let chest = this.chests.getFirstDead();
    if (!chest) {
      chest = new Chest({
        scene: this,
        x: chestObject.x * 2,
        y: chestObject.y * 2,
        texture: "items",
        coins: chestObject.gold,
        id: chestObject.id,
      });
      this.chests.add(chest);
    } else {
      chest.coins = chestObject.gold;
      chest.id = chestObject.id;
      chest.setPosition(chestObject.x * 2, chestObject.y * 2);
      chest.makeActive();
    }
  }

  spawnMonster(monsterObject) {
    // TO DO ADD MONSTER
    let monster = this.monsters.getFirstDead();
    if (!monster) {
      monster = new Monster(
        this,
        monsterObject.x * 2,
        monsterObject.y * 2,
        "monsters",
        monsterObject.frame,
        monsterObject.id,
        monsterObject.health,
        monsterObject.maxHealth
      );
      this.monsters.add(monster);
    } else {
      monster.id = monsterObject.id;
      monster.health = monsterObject.health;
      monster.maxHealth = monsterObject.maxHealth;
      monster.setTexture("monsters", monsterObject.frame);
      monster.setPosition(monsterObject.x * 2, monsterObject.y * 2);
      monster.makeActive();
    }
  }

  addCollisions() {
    this.physics.add.collider(this.player, this.map.blockedLayer);
    this.physics.add.overlap(
      this.player,
      this.chests,
      this.collectChest,
      undefined,
      this
    );

    this.physics.add.collider(this.monsters, this.map.blockedLayer);
    this.physics.add.overlap(
      this.player,
      this.monsters,
      this.enemyOverlap,
      undefined,
      this
    );
  }

  enemyOverlap(player, enemy) {
    enemy.makeInactive();
    this.events.emit("destroyEnemy", enemy.id);
  }

  createInputs() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  collectChest(player, chest) {
    this.goldPickUpAudio.play();
    this.score += 10;
    this.events.emit("updateScore", this.score);
    chest.makeInactive();
    this.events.emit("pickUpChest", chest.id);
  }

  createMap() {
    this.map = new Map(this, "map", "background", "background", "blocked");
  }

  createGameManager() {
    this.events.on("spawnPlayer", (location) => {
      this.createPlayer(location);
      this.addCollisions();
    });
    this.events.on("chestSpawned", (chest) => {
      this.spawnChest(chest);
    });
    this.events.on("monsterSpawned", (monster) => {
      this.spawnMonster(monster);
    });
    this.gameManager = new GameManager(this, this.map.map.objects);
    this.gameManager.setup();
  }
}
