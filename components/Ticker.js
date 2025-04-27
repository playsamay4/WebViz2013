import { config } from "../utils/config.js";
import { vizEvents } from '../utils/events.js';
import { newAnimWithDevTools } from '../utils/animations.js';

const TICKER_WIDTH = 1185;
const TICKER_HEIGHT = 45;
const TICKER_X = 735;
const TICKER_Y = 991;
const SCROLL_SPEED = 1.5;

export class Ticker {
  constructor(app) {
    this.isIn = false;
    this.init(app);

    vizEvents.on('ticker:out', () => this.tickerOut());
  }

  async init(app) {
    this.ctr = new PIXI.Container();
    this.ctr.label = "Ticker";

    this.createBacking();
    this.createMask();
    this.createContent();

    this.ctr.mask = this.tickerMask;
    app.stage.addChild(this.ctr);

    this.initTickerScroll();
  }

  createBacking() {
    const backing = new PIXI.Graphics();
    backing.rect(TICKER_X, TICKER_Y, TICKER_WIDTH, TICKER_HEIGHT);
    backing.fill(0x4C0000);
    backing.alpha = 1;
    this.ctr.addChild(backing);
  }

  createMask() {
    this.tickerMask = new PIXI.Graphics();
    this.tickerMask.rect(TICKER_X, TICKER_Y, TICKER_WIDTH, TICKER_HEIGHT);
    this.tickerMask.fill(0x00FF00);
    this.tickerMask.alpha = 1;
    this.tickerMask.x = TICKER_WIDTH;
    this.ctr.addChild(this.tickerMask);
  }

  createContent() {
    this.tickerContent = new PIXI.Container();
    this.tickerContent.label = "Ticker Content";

    const markerText = new PIXI.Text("HEADLINES", {
      fill: "#4c0000",
      fontFamily: 'Helvetica',
      fontSize: 33,
      fontWeight: "bold"
    });
    markerText.resolution = 2;
    markerText.x = TICKER_X + 10;
    markerText.y = TICKER_Y + 4;

    const markerBox = new PIXI.Graphics();
    markerBox.rect(TICKER_X, TICKER_Y, markerText.width + 20, TICKER_HEIGHT);
    markerBox.fill(0xFFFFFF);
    markerBox.alpha = 1;

    const headlinesText = new PIXI.Text(
      "MINISTERIAL TALKS IN PARIS ON THE UKRAINE CRISIS WERE \"TOUGH \" BUT WILL CONTINUE, THE US SAYS, AS A TENSE STAND-OFF CONTINUE IN CRIMEA ● VENEZUELA'S PRESIDENT NICOLAS MADURO BREAKS DIPLOMATIC RELATIONS WITH PANAMA OVER ITS REQUEST FOR THE OAS TO DISCUSS THE CRISIS IN VENEZUELA",
      {
        fill: "#ffffff",
        fontFamily: 'Helvetica',
        fontWeight: "bold",
        fontSize: 33,
        letterSpacing: 1.5
      }
    );
    headlinesText.resolution = 2;
    headlinesText.x = markerText.x + markerText.width + 30;
    headlinesText.y = markerText.y;

    this.tickerContent.addChild(markerBox, markerText, headlinesText);
    this.tickerContent.x = TICKER_WIDTH;
    this.ctr.addChild(this.tickerContent);
  }

  initTickerScroll() {
    this.contentTicker = new PIXI.Ticker();
    this.contentTicker.add(() => {
      if (!this.isIn) return;

      if (this.tickerContent.x < -this.tickerContent.width) {
        this.tickerContent.x = TICKER_WIDTH;
      }

      this.tickerContent.x -= SCROLL_SPEED * this.contentTicker.deltaTime;
    });
    this.contentTicker.start();
    this.contentTicker.speed = SCROLL_SPEED;
  }

  async tickerIn() {
    await vizEvents.emit('tile:out');
    if (this.isIn) return;
    this.isIn = true;

    const tl = newAnimWithDevTools("Show Ticker");
    return new Promise(resolve => {
      tl.to(this.tickerMask, {
        x: 0,
        duration: 0.8,
        ease: "sine.out",
        onComplete: resolve
      });
    });
  }

  async tickerOut() {
    await vizEvents.emit('tile:out');
    if (!this.isIn) return;

    const tl = newAnimWithDevTools("Hide Ticker");
    return new Promise(resolve => {
      tl.to(this.tickerMask, {
        x: TICKER_WIDTH,
        duration: 0.5,
        ease: "sine.in",
        onComplete: () => {
          this.isIn = false;
          this.tickerContent.x = TICKER_WIDTH;
          resolve();
        }
      });
    });
  }
}
