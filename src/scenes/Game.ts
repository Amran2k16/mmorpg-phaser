import Phaser from "phaser";
import Chest from "~/classes/Chest";
import Map from "~/classes/Map";
import Monster from "~/classes/Monster";
import PlayerContainer from "~/classes/player/PlayerContainer";
import GameManager from "~/gameManager/GameManager";
import MonsterModel from "~/gameManager/MonsterModel";
import Player from "../classes/player/Player";
import Ui from "./Ui";

export default class Game extends Phaser.Scene {
  private player: PlayerContainer;
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

  createPlayer(playerObject) {
    this.player = new PlayerContainer(
      this,
      playerObject.x * 2,
      playerObject.y * 2,
      "characters",
      0,
      250,
      playerObject.health,
      playerObject.maxHealth,
      playerObject.id
    );
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
    if (this.player.playerAttacking && !this.player.swordHit) {
      this.player.swordHit = true;
      this.events.emit("monsterAttacked", enemy.id, player.id);
    }
  }

  createInputs() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  collectChest(player, chest) {
    this.goldPickUpAudio.play();
    this.events.emit("updateScore", this.score);
    this.events.emit("pickUpChest", chest.id, player.id);
  }

  createMap() {
    this.map = new Map(this, "map", "background", "background", "blocked");
  }

  createGameManager() {
    this.events.on("spawnPlayer", (playerObject) => {
      this.createPlayer(playerObject);
      this.addCollisions();
    });
    this.events.on("chestSpawned", (chest) => {
      this.spawnChest(chest);
    });
    this.events.on("monsterSpawned", (monster) => {
      this.spawnMonster(monster);
    });

    this.events.on("monsterRemoved", (monsterId) => {
      // @ts-ignore
      console.log("Monster should be removed!!");
      this.monsters.getChildren().forEach((monster: Monster) => {
        if (monster.id === monsterId) {
          console.log(monster);
          monster.makeInactive();
        }
      });
    });
    this.events.on("chestRemoved", (chestId) => {
      // @ts-ignore
      console.log("Monster should be removed!!");
      this.chests.getChildren().forEach((chest: any) => {
        if (chest.id === chestId) {
          chest.makeInactive();
        }
      });
    });

    this.events.on("updateMonsterHealth", (monsterId, health) => {
      // @ts-ignore
      this.monsters.getChildren().forEach((monster: Monster) => {
        if (monster.id === monsterId) {
          monster.updateHealth(health);
          // monster.makeInactive();
        }
      });
    });

    this.events.on("updatePlayerHealth", (playerId, health) => {
      this.player.updateHealth(health);
    });

    this.events.on("respawnPlayer", (playerObject) => {
      this.player.respawn(playerObject);
    });

    this.gameManager = new GameManager(this, this.map.map.objects);
    this.gameManager.setup();
  }
}
