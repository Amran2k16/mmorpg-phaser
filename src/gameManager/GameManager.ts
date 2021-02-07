import Spawner from "./Spawner";

export default class GameManager {
  spawners = {};
  chests = {};

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
          this.playerLocations.push([obj.x, obj.y]);
        });
      } else if (layer.name === "chest_locations") {
        layer.objects.forEach((obj) => {
          if (this.chestLocations[obj.properties.spawner]) {
            this.chestLocations[obj.properties.spawner].push([obj.x, obj.y]);
          } else {
            this.chestLocations[obj.properties.spawner] = [[obj.x, obj.y]];
          }
        });
      } else if (layer.name === "monster_locations") {
        layer.objects.forEach((obj) => {
          if (this.monsterLocations[obj.properties.spawner]) {
            this.monsterLocations[obj.properties.spawner].push([obj.x, obj.y]);
          } else {
            this.monsterLocations[obj.properties.spawner] = [[obj.x, obj.y]];
          }
        });
      }
    });
  }

  setupEventListeners() {}

  setupSpawners() {
    console.log(this.chestLocations);
    // Create chest spawners
    Object.keys(this.chestLocations).forEach((key) => {
      const config = {
        spawnInterval: 3000,
        limit: 3,
        objectType: "CHEST",
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
  }

  addChest(chestId, chest) {
    this.chests[chestId] = chest;
    console.log(chest);
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
