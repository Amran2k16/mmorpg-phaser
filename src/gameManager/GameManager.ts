import Spawner from "./Spawner";
import { SpawnerType } from "./utils";

export default class GameManager {
  spawners = {};
  chests = {};
  monsters = {};
  playerLocations: any = [];
  chestLocations = {};
  monsterLocations = {};
  constructor(public scene, public mapData) {
    this.setup();
  }

  setup() {
    this.parseMapData();
    this.setupEventListeners();
    this.setupSpawners();
    this.spawnPlayer();
  }

  // https://academy.zenva.com/lesson/parsing-map-data-with-recent-versions-of-tiled/?zva_less_compl=1254012
  parseMapData() {
    this.mapData.forEach((layer) => {
      if (layer.name === "player_locations") {
        layer.objects.forEach((obj) => {
          this.playerLocations.push([
            obj.x + obj.width / 2,
            obj.y - obj.height / 2,
          ]);
        });
      } else if (layer.name === "chest_locations") {
        layer.objects.forEach((obj) => {
          if (this.chestLocations[obj.properties.spawner]) {
            this.chestLocations[obj.properties.spawner].push([
              obj.x + obj.width / 2,
              obj.y - obj.height / 2,
            ]);
          } else {
            this.chestLocations[obj.properties.spawner] = [
              [obj.x + obj.width / 2, obj.y - obj.height / 2],
            ];
          }
        });
      } else if (layer.name === "monster_locations") {
        layer.objects.forEach((obj) => {
          if (this.monsterLocations[obj.properties.spawner]) {
            this.monsterLocations[obj.properties.spawner].push([
              obj.x + obj.width / 2,
              obj.y - obj.height / 2,
            ]);
          } else {
            this.monsterLocations[obj.properties.spawner] = [
              [obj.x + obj.width / 2, obj.y - obj.height / 2],
            ];
          }
        });
      }
    });
  }

  setupEventListeners() {
    this.scene.events.on("pickUpChest", (chestId) => {
      if (this.chests[chestId]) {
        this.spawners[this.chests[chestId].spawnerId].removeObject(chestId);
      }
    });

    this.scene.events.on("monsterAttacked", (monsterId) => {
      if (this.monsters[monsterId]) {
        // Subtract health from monster model
        this.monsters[monsterId].loseHealth();

        // check the monsters health, and if dead remove that object
        if (this.monsters[monsterId].health <= 0) {
          this.spawners[this.monsters[monsterId].spawnerId].removeObject(
            monsterId
          );
          this.scene.events.emit("monsterRemoved", monsterId);
        } else {
          this.scene.events.emit(
            "updateMonsterHealth",
            monsterId,
            this.monsters[monsterId].health
          );
        }
      }
    });
  }

  setupSpawners() {
    Object.keys(this.chestLocations).forEach((key) => {
      const config = {
        spawnInterval: 3000,
        limit: 3,
        objectType: SpawnerType.CHEST,
        id: `chest-${key}`,
      };
      const spawner = new Spawner(
        config,
        this.chestLocations[key],
        this.addChest.bind(this),
        this.deleteChest.bind(this)
      );
      this.spawners[spawner.id] = spawner;
    });

    Object.keys(this.monsterLocations).forEach((key) => {
      const config = {
        spawnInterval: 3000,
        limit: 3,
        objectType: SpawnerType.MONSTER,
        id: `monster-${key}`,
      };
      const spawner = new Spawner(
        config,
        this.monsterLocations[key],
        this.addMonster.bind(this),
        this.deleteMonster.bind(this)
      );
      this.spawners[spawner.id] = spawner;
    });
  }

  addMonster(monsterId, monster) {
    this.monsters[monsterId] = monster;
    this.scene.events.emit("monsterSpawned", monster);
  }

  deleteMonster(monsterId) {
    delete this.monsters[monsterId];
  }

  addChest(chestId, chest) {
    this.chests[chestId] = chest;
    this.scene.events.emit("chestSpawned", chest);
  }

  deleteChest(chestId) {
    delete this.chests[chestId];
  }
  spawnPlayer() {
    const location = this.playerLocations[
      Math.floor(Math.random() * this.playerLocations.length)
    ];
    this.scene.events.emit("spawnPlayer", location);
  }
}
