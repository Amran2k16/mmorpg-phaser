import Phaser from "phaser";
import Player from "./Player";

const Direction = {
  RIGHT: "RIGHT",
  LEFT: "LEFT",
  UP: "UP",
  DOWN: "DOWN",
};
export default class PlayerContainer extends Phaser.GameObjects.Container {
  public scene;
  public player: Player;
  public velocity: number;
  public currentDirection;
  public playerAttacking;
  public flipX;
  public swordHit;
  public weapon;

  constructor(scene, x, y, key, frame, velocity) {
    super(scene, x, y);
    this.scene = scene;
    this.velocity = velocity;
    this.currentDirection = Direction.RIGHT;
    this.playerAttacking = false;
    this.flipX = true;
    this.swordHit = false;

    this.setSize(64, 64);

    this.scene.physics.world.enable(this);

    // @ts-ignore
    this.body.setCollideWorldBounds(true); // NEW

    this.scene.add.existing(this);

    this.scene.cameras.main.startFollow(this);

    this.player = new Player(this.scene, 0, 0, key, frame);
    this.add(this.player);

    // Create weapon game object and add it to container
    this.weapon = this.scene.add.image(40, 0, "items", 4);
    this.scene.add.existing(this.weapon);
    this.weapon.setScale(1.5);
    this.scene.physics.world.enable(this.weapon);
    this.add(this.weapon);
    this.weapon.alpha = 0;
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    this.body.setVelocity(0, 0);
    if (cursors.right.isDown) {
      this.body.setVelocityX(this.velocity);
      this.currentDirection = Direction.RIGHT;
      this.weapon.setPosition(40, 0);
    } else if (cursors.left.isDown) {
      this.body.setVelocityX(-this.velocity);
      this.currentDirection = Direction.LEFT;
      this.weapon.setPosition(-40, 0);
    }
    if (cursors.down.isDown) {
      this.body.setVelocityY(this.velocity);
      this.currentDirection = Direction.DOWN;
      this.weapon.setPosition(0, 40);
    } else if (cursors.up.isDown) {
      this.body.setVelocityY(-this.velocity);
      this.currentDirection = Direction.UP;
      this.weapon.setPosition(0, -40);
    }

    if (
      Phaser.Input.Keyboard.JustDown(cursors.space) &&
      !this.playerAttacking
    ) {
      this.weapon.alpha = 1;
      this.playerAttacking = true;
      this.scene.time.delayedCall(
        150,
        () => {
          this.weapon.alpha = 0;
          this.playerAttacking = false;
          this.swordHit = false;
        },
        [],
        this
      );
    }

    if (this.playerAttacking) {
      if (this.weapon.flipX) {
        this.weapon.angle -= 10;
      } else {
        this.weapon.angle += 10;
      }
    } else {
      if (this.currentDirection === Direction.DOWN) {
        this.weapon.setAngle(-270);
      } else if (this.currentDirection === Direction.UP) {
        this.weapon.setAngle(-90);
      } else {
        this.weapon.setAngle(-0);
      }
      this.weapon.flipX = false;
      if (this.currentDirection === Direction.LEFT) {
        this.weapon.flipX = true;
      }
    }
  }
}