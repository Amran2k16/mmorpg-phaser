export default class Ui extends Phaser.Scene {
  scoreText: Phaser.GameObjects.Text;
  coinIcon: Phaser.GameObjects.Image;
  gameScene: Phaser.Scene;
  constructor() {
    super("Ui");
  }

  init() {
    // Grab a reference to the game scene
    this.gameScene = this.scene.get("Game");
  }
  create() {
    this.setupUiElements();
    this.setupEvents();
  }

  setupUiElements() {
    this.scoreText = this.add.text(35, 8, "Coins: 0", {
      fontSize: "16px",
      color: "#fff",
    });
    this.coinIcon = this.add.image(15, 15, "items", 3);
  }
  setupEvents() {
    this.gameScene.events.on("updateScore", (score) => {
      console.log(score);
      this.scoreText.setText(`Coins: ${score}`);
    });
  }
}
