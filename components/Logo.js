import { config } from '../utils/config.js';
import { vizEvents } from '../utils/events.js';
import { newAnimWithDevTools } from '../utils/animations.js';
import { getTimeStr } from "../utils/textUtils.js";
import { RemoveFromGraphicsStatus } from "../utils/websocket.js";

const LOGO_WIDTH = 735;
const LOGO_Y = 991;
const LOGO_HEIGHT = 45;
const CLOCK_START_X = 600;
const CLOCK_FADE_DELAY = 0.03;
const ANIM_DURATION_IN = 0.5;
const ANIM_DURATION_OUT = 0.5;

export class Logo {
  constructor(app) {
    this.app = app;
    this.isIn = false;

    this.init();

    vizEvents.on('logo:out', () => this.logoOut());
  }

  async init() {
    this.ctr = new PIXI.Container();
    this.ctr.label = "Logo";
    this.ctr.x = -LOGO_WIDTH;

    this.createBacking();
    await this.createLogoSprite();
    this.createNewsText();

    this.app.stage.addChild(this.ctr);
  }

  createBacking() {
    const backing = new PIXI.Graphics();
    backing.rect(0, LOGO_Y, LOGO_WIDTH, LOGO_HEIGHT);
    backing.fill(0x8b0000);
    this.ctr.addChild(backing);
  }

  async createLogoSprite() {
    try {
      const texture = await PIXI.Assets.load("images/GillSansLogo.png");
      this.logoSprite = new PIXI.Sprite(texture);
      this.logoSprite.position.set(287, 995);
      this.logoSprite.width = 129;
      this.logoSprite.height = 37;
      this.logoSprite.alpha = 1;
      this.ctr.addChild(this.logoSprite);
    } catch (err) {
      console.error("Failed to load logo image", err);
    }
  }

  createNewsText() {
    this.newsText = new PIXI.Text("NEWS", {
      fill: "#ffffff",
      fontFamily: 'Gill Sans MT',
      fontSize: 40.5,
      letterSpacing: 1
    });
    this.newsText.resolution = 2;
    this.newsText.x = 433.288;
    this.newsText.y = 989;
    this.ctr.addChild(this.newsText);
  }

  setClockTime(time) {
    if (!this.clockLetters) return;

    for (let i = 0; i < time.length; i++) {
      if (this.clockLetters[i]) {
        this.clockLetters[i].text = time[i];
      }
    }
  }

  async logoIn() {
    await vizEvents.emit('tile:out');
    if (this.isIn) return;

    this.isIn = true;
    const tl = newAnimWithDevTools("Show Logo");

    return new Promise(resolve => {
      tl.to(this.ctr, {
        x: 0,
        duration: ANIM_DURATION_IN,
        ease: "sine.out",
        onComplete: () => {
          this.renderClockTime(getTimeStr(), { fadeIn: true });

          if (window.tickerComponent?.tickerIn) {
            window.tickerComponent.tickerIn();
          }

          resolve();
        }
      });
    });
  }

  async logoOut() {
    if (!this.isIn) return;

    await this.wipeOutClockTime();

    if (window.tickerComponent?.tickerOut) {
      window.tickerComponent.tickerOut();
    }

    return new Promise(resolve => {
      const tl = newAnimWithDevTools("Hide Logo");

      tl.to(this.ctr, {
        x: -LOGO_WIDTH,
        duration: ANIM_DURATION_OUT,
        ease: "sine.in",
        onComplete: () => {
          this.isIn = false;
          RemoveFromGraphicsStatus("[LOGO ON]");
          resolve();
        }
      });
    });
  }

  renderClockTime(time, { fadeIn = false } = {}) {
    if (this.clockLetters) {
      this.clockLetters.forEach(letter => this.ctr.removeChild(letter));
    }

    this.clockLetters = [];

    let x = CLOCK_START_X;

    for (let i = 0; i < time.length; i++) {
      const char = time[i];
      const letter = new PIXI.Text(char, {
        fill: "#ffffff",
        fontFamily: 'Helvetica',
        fontWeight: "bold",
        fontSize: 39
      });
      letter.resolution = 2;
      letter.alpha = fadeIn ? 0 : 1;
      letter.x = x;
      letter.y = LOGO_Y + 0.5;

      this.ctr.addChild(letter);
      this.clockLetters.push(letter);

      if (fadeIn) {
        gsap.to(letter, {
          alpha: 1,
          duration: 0.1,
          delay: i * CLOCK_FADE_DELAY
        });
      }

      x += letter.width;
    }
  }

  wipeOutClockTime() {
    return new Promise(resolve => {
      if (!this.clockLetters?.length) {
        resolve();
        return;
      }

      this.clockLetters.forEach((letter, i) => {
        gsap.to(letter, {
          alpha: 0,
          duration: 0.1,
          delay: i * CLOCK_FADE_DELAY,
          onComplete: () => {
            if (i === this.clockLetters.length - 1) {
              resolve();
            }
          }
        });
      });
    });
  }
}
