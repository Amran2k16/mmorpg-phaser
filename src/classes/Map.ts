export default class Map {
  public map: Phaser.Tilemaps.Tilemap | any;
  private tiles: Phaser.Tilemaps.Tileset;
  private backgroundLayer: any;
  public blockedLayer: any;

  constructor(
    public scene,
    public key, // tiled json file keyname
    public tileSetName, // tiled tilset image keyname
    public backgroundLayerName, // name of the layer created
    public blockedLayerName // name of the blocked layer created
  ) {
    this.createMap();
  }

  createMap() {
    // add tilemap, need the key for the tilemap...
    // this is the tilemapTiledJSON we load on boot which is a json file
    this.map = this.scene.make.tilemap({ key: this.key });

    // add tileset image, which is just a regular image? in our boot
    this.tiles = this.map.addTilesetImage(
      this.tileSetName,
      this.tileSetName,
      32,
      32,
      1,
      2
    );

    // the tilemap json file is used to create a static layer
    // using our json file layer keys.
    this.backgroundLayer = this.map.createStaticLayer(
      this.backgroundLayerName,
      this.tiles,
      0,
      0
    );
    this.backgroundLayer.setScale(2);

    // the tilemap json file is used to create a static layer
    // using our json file layer keys.
    this.blockedLayer = this.map.createStaticLayer(
      this.blockedLayerName,
      this.tiles,
      0,
      0
    );
    this.blockedLayer.setScale(2);
    this.blockedLayer.setCollisionByExclusion([-1]);

    this.scene.physics.world.bounds.width = this.map.widthInPixels * 2;
    this.scene.physics.world.bounds.height = this.map.heightInPixels * 2;

    this.scene.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels * 2,
      this.map.heightInPixels * 2
    );
  }
}
