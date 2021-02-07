import { v4 as uuidv4 } from "uuid";

export default class ChestModel {
  public id;
  public x;
  public y;
  public gold;
  public spawnerId;

  constructor(x, y, gold, spawnerId) {
    this.id = `${spawnerId}-${uuidv4()}`;
    this.x = x;
    this.y = y;
    this.gold = gold;
    this.spawnerId = spawnerId;
  }
}
