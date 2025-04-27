import { newAnimWithDevTools } from "../utils/animations.js";
import { vizEvents } from "../utils/events.js";
import { RemoveFromGraphicsStatus } from "../utils/websocket.js";

const TILE_FADE_DURATION = 0.4;

export class Tile {
  constructor(app, tileType) {
    this.app = app;
    this.tileType = tileType;
    this.isIn = false;

    this.init();

    vizEvents.on('tile:out', () => this.out());
  }

  async init() {
    try {
      const tileTexture = await PIXI.Assets.load(`tiles/${this.tileType}.png`);
      this.tileSprite = new PIXI.Sprite(tileTexture);
      this.tileSprite.id = "Tile";
      this.tileSprite.alpha = 0;
      this.app.stage.addChild(this.tileSprite);
    } catch (err) {
      console.error(`Failed to load tile texture: ${this.tileType}`, err);
    }
  }

  async in() {
    if (this.isIn) return false;

    await vizEvents.emit('headline:out');
    await vizEvents.emit('logo:out');
    await vizEvents.emit('ticker:out');

    this.isIn = true;

    const tl = newAnimWithDevTools("Tile In");
    return new Promise(resolve => {
      tl.to(this.tileSprite, {
        alpha: 1,
        duration: TILE_FADE_DURATION,
        onComplete: () => resolve(true)
      });
    });
  }

  async out() {
    if (!this.isIn) return false;

    this.isIn = false;

    const tl = newAnimWithDevTools("Tile Out");
    return new Promise(resolve => {
      tl.to(this.tileSprite, {
        alpha: 0,
        duration: TILE_FADE_DURATION,
        onComplete: () => {
          RemoveFromGraphicsStatus(".5");
          resolve(true);
        }
      });
    });
  }
}
