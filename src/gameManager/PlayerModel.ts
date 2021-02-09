import { v4 as uuidv4 } from "uuid";

export default class PlayerModel {
  public x;
  public y;
  public health;
  public maxHealth;
  public gold;
  public id;
  public spawnLocations;
  constructor(spawnLocations) {
    this.health = 10;
    this.maxHealth = 10;
    this.gold = 0;
    this.id = `player-${uuidv4()}`;
    this.spawnLocations = spawnLocations;
    const location = this.spawnLocations[
      Math.floor(Math.random() * this.spawnLocations.length)
    ];
    [this.x, this.y] = location;
  }
  updateGold(gold) {
    this.gold += gold;
  }
  updateHealth(health) {
    this.health += health;
    console.log(this.health);
  }

  respawn() {
    this.health = this.maxHealth;
    const location = this.spawnLocations[
      Math.floor(Math.random() * this.spawnLocations.length)
    ];
    this.x = location[0] * 2;
    this.y = location[1] * 2;
  }
}
