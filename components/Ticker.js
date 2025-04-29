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
    this.backing = new PIXI.Graphics();
    this.backing.rect(TICKER_X, TICKER_Y, TICKER_WIDTH, TICKER_HEIGHT);
    this.backing.fill(0x4C0000);
    this.backing.alpha = 1;
    this.ctr.addChild(this.backing);
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
  
    const tickerData = [
      "[BREAKING]",
      "MANCHESTER UNITED ARE RUBBISH",
      "[HEADLINES]",
      "SUSPECT CHARGED AFTER VANCOUVER CAR RAMMIN LEAVES 11 DEAD",
      "WEATHER RAIN EVERYWHERE",
      "[MORE NEWS AT]",
      "bbc.com/news",
      "facebook.com/bbcnews",
      "TWITTER: @BBCWorld AND @BBCBreaking",
    ];
  
    const styles = {
      label: {
        fill: "#4c0000",
        fontFamily: 'Helvetica Neue',
        fontSize: 33,
        fontWeight: "bold"
      },
      content: {
        fill: "#ffffff",
        fontFamily: 'Helvetica Neue',
        fontSize: 33,
        fontWeight: "bold",
        letterSpacing: 1.5
      },
      bullet: {
        fill: "#ffffff",
        fontFamily: 'Helvetica Neue',
        fontSize: 33,
        fontWeight: "bold"
      }
    };
  
    const makeTickerBlock = () => {
      const block = new PIXI.Container();
      let x = TICKER_X;
      const y = TICKER_Y + 2;
      const padding = 30;
      const bulletGap = 60;
    
      let inBreaking = false;
      let breakingStartX = null;
      let breakingEndX = null;
      let breakingOnly = false;
    
      // Check if tickerData has only one label and it's BREAKING
      const allLabels = tickerData.filter(line => /^\[.*\]$/.test(line));
      if (allLabels.length === 1 && allLabels[0].toUpperCase() === "[BREAKING]") {
        breakingOnly = true;
      }
    
      for (let i = 0; i < tickerData.length; i++) {
        const isLabel = /^\[.*\]$/.test(tickerData[i]);
        const labelTextRaw = tickerData[i].replace(/\[|\]/g, "");
        const isBreakingLabel = labelTextRaw.toUpperCase() === "BREAKING";
    
        const isContent = !isLabel;
        const styleToUse = isLabel
          ? (isBreakingLabel ? { ...styles.label, fill: 0x8B0000 } : styles.label)
          : styles.content;
    
        // Handle [BREAKING] logic
        if (isBreakingLabel) {
          inBreaking = true;
          breakingStartX = x;
        } else if (isLabel && inBreaking) {
          breakingEndX = x;
          inBreaking = false;
        }
    
        // Draw label text
        if (isLabel) {
          const labelText = new PIXI.Text(labelTextRaw, styleToUse);
          labelText.resolution = 2;
          labelText.x = x;
          labelText.y = y;
    
          const box = new PIXI.Graphics();
          box.rect(x - 10, TICKER_Y, labelText.width + 20, TICKER_HEIGHT);
          box.fill(0xFFFFFF);
          block.addChild(box);
          block.addChild(labelText);
    
          x += labelText.width + padding;
          continue; // Skip bullets for labels
        }
    
        // Draw content text
        const textItem = new PIXI.Text(labelTextRaw, styleToUse);
        textItem.resolution = 2;
        textItem.x = x;
        textItem.y = y;
        block.addChild(textItem);
        x += textItem.width;
    
        // Add bullet between normal content
        const next = tickerData[i + 1];
        const nextIsLabel = /^\[.*\]$/.test(next || "");
    
        if (!isLabel && next && !nextIsLabel) {
          x += bulletGap / 2;
    
          const bullet = new PIXI.Text("●", styles.bullet);
          bullet.resolution = 2;
          bullet.x = x;
          bullet.y = y;
          block.addChild(bullet);
    
          x += bullet.width + bulletGap / 2;
        } else {
          x += padding;
        }
      }
    
      // If breaking never ended, we were in a single [BREAKING] block to end
      if (inBreaking && !breakingEndX) breakingEndX = x;
    
      this.backing.rect(TICKER_X, TICKER_Y, TICKER_WIDTH, TICKER_HEIGHT);
      this.backing.fill(0x4C0000);

      // Full red bar background if only [BREAKING]
      if (breakingOnly) {
        this.backing.rect(TICKER_X, TICKER_Y, TICKER_WIDTH, TICKER_HEIGHT);
        this.backing.fill(0x8B0000);
      }
      // Regular [BREAKING] section background
      else if (breakingStartX !== null && breakingEndX !== null) {
        const redBG = new PIXI.Graphics();
        redBG.rect(breakingStartX, TICKER_Y, breakingEndX - breakingStartX, TICKER_HEIGHT);
        redBG.fill(0x8B0000);
        redBG.zIndex = -1;
        block.addChildAt(redBG, 0);
      }
    
      return block;
    };
    
  
    const ticker1 = makeTickerBlock();
    const ticker2 = makeTickerBlock();
  
    const loopGap = 100;
    ticker2.x = ticker1.width + loopGap;
  
    this.tickerContent.addChild(ticker1, ticker2);
    this.ctr.addChild(this.tickerContent);
  
    this.fullTickerWidth = ticker1.width + loopGap;
  }
  
  

  initTickerScroll() {
    this.tickerContent.x = TICKER_WIDTH;

    this.contentTicker = new PIXI.Ticker();
    this.contentTicker.add(() => {
      if (!this.isIn) return;
  
      // Instead of waiting for whole container to go offscreen,
      // restart when it finishes 1 scroll width
      if (this.tickerContent.x <= -this.fullTickerWidth) {
        this.tickerContent.x = 0;
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
