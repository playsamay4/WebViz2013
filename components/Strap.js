import { newAnimWithDevTools } from "../utils/animations.js";
import { vizEvents } from "../utils/events.js";
import { RemoveFromGraphicsStatus } from "../utils/websocket.js";

// Helper: fit text to max width
function fitTextToWidthHeadline(textObject, maxWidth, originalFontSize) {
    return new Promise(resolve => {
        let fontSize = originalFontSize;

        textObject.style.fontSize = fontSize;

        while (textObject.width > maxWidth && fontSize > 1) {
            fontSize--;
            textObject.style.fontSize = fontSize;
        }

        const yOffset = (112 - textObject.height) / 2; // 112 = strap height

        resolve({ fontSize, yOffset });
    });
}

// Helper: animate wipe-in effect
async function renderHeadlineWipeIn(container, text, maxWidth, originalFontSize) {
    container.removeChildren();

    const previewText = new PIXI.Text(text, {
        fontFamily: 'Helvetica',
        fontWeight: "bold",
        fontSize: originalFontSize,
        fill: 0x000000
    });

    const { fontSize, yOffset } = await fitTextToWidthHeadline(previewText, maxWidth, originalFontSize);

    let x = 270;
    const delayStep = 0.01;

    for (let i = 0; i < text.length; i++) {
        const letter = new PIXI.Text(text[i], {
            fontFamily: 'Helvetica',
            fontWeight: "bold",
            fontSize: fontSize,
            fill: 0x8b0000
        });

        letter.alpha = 0;
        letter.x = x;
        letter.y = 879 + yOffset;
        letter.resolution = 2;

        container.addChild(letter);

        gsap.to(letter, {
            alpha: 1,
            duration: 0.1,
            delay: i * delayStep
        });

        x += letter.width;
    }
}

// Helper: animate wipe-out effect
function wipeOutHeadline(container) {
    return new Promise(resolve => {
        const children = container.children;
        const delayStep = 0.01;

        if (!children.length) {
            resolve();
            return;
        }

        children.forEach((child, i) => {
            gsap.to(child, {
                alpha: 0,
                duration: 0.1,
                delay: i * delayStep,
                onComplete: () => {
                    if (i === children.length - 1) {
                        container.removeChildren();
                        resolve();
                    }
                }
            });
        });
    });
}

export class Strap {
    STATES = Object.freeze({
        OFF: 0,
        HEADLINE: 1,
        ONE_LINE: 2,
        TWO_LINE: 3,
    });

    currentState = this.STATES.OFF;

    constructor(app) {
        this.app = app;
        this.isIn = false;

        this.init();

        vizEvents.on('strap:out', () => this.out());
    }

    async init() {
        this.ctr = new PIXI.Container();
        this.ctr.label = "Strap";
        this.ctr.y = 112;

        this.createBacking();
        this.createMask();
        this.textContainer = new PIXI.Container();
        this.ctr.addChild(this.textContainer);

        this.app.stage.addChild(this.ctr);
    }

    createMask() {
        this.mask = new PIXI.Graphics();
        
        this.mask.rect(0, 879, 1920, 112);
        this.mask.fill(0xFFFFFF);
        
        

        this.ctr.mask = this.mask;
    }

    createBacking() {
        this.backing = new PIXI.Graphics();
        this.backing.rect(0, 879, 1920, 112);
        this.backing.fill(0xFFFFFF);
        this.backing.alpha = 0.8;

        this.ctr.addChild(this.backing);
    }

    async showHeadline(text) {
        if (this.isIn && this.currentState === this.STATES.HEADLINE) {
            return;
        }

        this.currentState = this.STATES.HEADLINE;
        this.isIn = true;

        const anim = newAnimWithDevTools("Strap In");

        return new Promise(resolve => {
            setTimeout(async () => {
                await renderHeadlineWipeIn(this.textContainer, text, 1400, 95); // maxWidth, fontSize
                resolve();
            }, 500);
            anim.to(this.ctr, {
                y:0,
                duration: 0.7,
                ease: "sine.out",
                
            });
        });
    }

    async out() {
        if (!this.isIn) return;

        await wipeOutHeadline(this.textContainer);

        const anim = newAnimWithDevTools("Strap Out");

        return new Promise(resolve => {
            anim.to(this.ctr, {
                y: 112,
                duration: 0.7,
                ease: "sine.out",
                onComplete: () => {
                    this.currentState = this.STATES.OFF;
                    this.isIn = false;
                    RemoveFromGraphicsStatus("[STRAP]");
                    resolve();
                }
            });
        });
    }
}
