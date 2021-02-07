import { v4 as uuidv4 } from "uuid";

export default class MonsterModel {
  public id;
  public x;
  public y;
  public gold;
  public spawnerId;
  public frame;
  public maxHealth;
  public health;
  public attack;

  constructor(x, y, gold, spawnerId, frame, health, attack) {
    this.id = `${spawnerId}-${uuidv4()}`;
    this.x = x;
    this.y = y;
    this.gold = gold;
    this.spawnerId = spawnerId;
    this.frame = frame;
    this.health = health;
    this.maxHealth = health;
    this.attack = attack;
  }
}
