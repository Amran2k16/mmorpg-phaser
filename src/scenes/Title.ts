import UiButton from "~/classes/UiButton";

export default class Title extends Phaser.Scene {
  private titleText: Phaser.GameObjects.Text;
  private startGameButton: UiButton;
  constructor() {
    super("Title");
  }

  create() {
    // Create title text
    this.titleText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      "MMORPG",
      { fontSize: "64px", color: "#fff" }
    );
    this.titleText.setOrigin(0.5);

    this.startGameButton = new UiButton(
      this,
      this.scale.width / 2,
      this.scale.height * 0.6,
      "button1",
      "button2",
      "Start Game",
      this.startScene.bind(this, "Game")
    );
  }

  startScene(targetScene) {
    console.log("hello");
    this.scene.start(targetScene);
  }
}
