import Phaser from "phaser";
import Game from "./scenes/Game";
import Boot from "./scenes/Boot";
import Title from "./scenes/Title";
import Ui from "./scenes/Ui";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 0 },
    },
  },
  scene: [Boot, Game, Title, Ui],
};

export default new Phaser.Game(config);
