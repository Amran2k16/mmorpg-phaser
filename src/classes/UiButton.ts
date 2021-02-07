export default class UiButton extends Phaser.GameObjects.Container {
  private button: Phaser.GameObjects.Image;
  private buttonText: Phaser.GameObjects.Text;
  constructor(
    public scene,
    public x,
    public y,
    public key,
    public hoverKey,
    public text,
    public targetCallback
  ) {
    super(scene, x, y);
    this.createButton();
    this.scene.add.existing(this);
  }

  createButton() {
    this.button = this.scene.add.image(0, 0, this.key);
    this.button.setInteractive();
    this.button.setScale(1.4);

    this.buttonText = this.scene.add.text(0, 0, this.text, {
      fontSize: "26px",
      fill: "#fff",
    });
    Phaser.Display.Align.In.Center(this.buttonText, this.button);

    this.add(this.button);
    this.add(this.buttonText);

    this.button.on("pointerdown", () => {
      this.targetCallback();
    });

    this.button.on("pointerover", () => {
      this.button.setTexture(this.hoverKey);
    });

    this.button.on("pointerout", () => {
      this.button.setTexture(this.key);
    });
  }
}