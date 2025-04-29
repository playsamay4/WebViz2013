import { newAnimWithDevTools } from "../utils/animations.js";
import { vizEvents } from "../utils/events.js";
import { RemoveFromGraphicsStatus } from "../utils/websocket.js";

// Helper: fit text to max width
function fitTextToWidth(textObject, maxWidth, originalFontSize, strapHeight, letterSpacing = 0) {
    return new Promise(resolve => {
        let fontSize = originalFontSize;

        textObject.style.fontSize = fontSize;

        while ((textObject.width + (textObject.text.length - 1) * letterSpacing) > maxWidth && fontSize > 1) {
            fontSize--;
            textObject.style.fontSize = fontSize;
        }

        const yOffset = (strapHeight - textObject.height) / 2;

        resolve({ fontSize, yOffset });
    });
}


// Helper: animate wipe-in effect
async function renderHeadlineWipeIn(container, text, maxWidth, originalFontSize, fontColor = 0x8b0000) {
    container.removeChildren();

    const previewText = new PIXI.Text(text, {
        fontFamily: 'Helvetica',
        fontWeight: "bold",
        fontSize: originalFontSize,
        fill: 0x000000
    });

    const { fontSize, yOffset } = await fitTextToWidth(previewText, maxWidth, originalFontSize, 112);

    let x = 280;
    const totalDuration = 0.2;
    const delayStep = totalDuration / text.length;

    for (let i = 0; i < text.length; i++) {
        const letter = new PIXI.Text(text[i], {
            fontFamily: 'Helvetica',
            fontWeight: "bold",
            fontSize: fontSize,
            fill: fontColor
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

async function renderTopLineWipeIn(container, text, maxWidth, originalFontSize, fontColor = 0x343337) {
    container.removeChildren();

    const previewText = new PIXI.Text(text, {
        fontFamily: 'Helvetica Neue',
        fontWeight: "bold",
        fontSize: originalFontSize,
        fill: 0x000000
    });

    const { fontSize, yOffset } = await fitTextToWidth(previewText, maxWidth, originalFontSize, 56);

    let x = 285;
    const totalDuration = 0.2;
    const delayStep = totalDuration / text.length;

    for (let i = 0; i < text.length; i++) {
        const letter = new PIXI.Text(text[i], {
            fontFamily: 'Helvetica Neue',
            fontWeight: "bold",
            fontSize: fontSize,
            fill: fontColor
        });

        letter.alpha = 0;
        letter.x = x;
        letter.y = 879 + yOffset;
        //letter.resolution = 9;

        container.addChild(letter);

        gsap.to(letter, {
            alpha: 1,
            duration: 0.1,
            delay: i * delayStep
        });

        x += letter.width + 1;
    }
}

async function renderBottomLineWipeIn(container, text, maxWidth, originalFontSize, fontColor = 0x343337) {
    container.removeChildren();

    const previewText = new PIXI.Text(text, {
        fontFamily: 'Helvetica Neue',
        fontWeight: 550,
        fontSize: originalFontSize,
        fill: 0x000000
    });

    const { fontSize, yOffset } = await fitTextToWidth(previewText, maxWidth, originalFontSize, 45);

    let x = 285;
    //const delayStep = 0.01;
    const totalDuration = 0.2;
    const delayStep = totalDuration / text.length;


    for (let i = 0; i < text.length; i++) {
        const letter = new PIXI.Text(text[i], {
            fontFamily: 'Helvetica Neue',
            fontWeight: 550,
            fontSize: fontSize,
            fill: fontColor
        });

        letter.alpha = 0;
        letter.x = x;
        letter.y = 935 + yOffset;
        //letter.resolution = 9;

        container.addChild(letter);

        gsap.to(letter, {
            alpha: 1,
            duration: 0.1,
            delay: i * delayStep
        });

        x += letter.width;
    }
}


async function renderLeftNewsTabWipeIn(container, text, maxWidth, originalFontSize, fontColor = 0x343337) {
    container.removeChildren();

    const previewText = new PIXI.Text(text, {
        fontFamily: 'Helvetica Neue',
        fontWeight: "bold",
        fontSize: originalFontSize,
        fill: 0x000000
    });

    const { fontSize, yOffset } = await fitTextToWidth(previewText, maxWidth, originalFontSize, 56, 2);

    let x = 285;
    const totalDuration = 0.2;
    const delayStep = totalDuration / text.length;

    for (let i = 0; i < text.length; i++) {
        const letter = new PIXI.Text(text[i], {
            fontFamily: 'Helvetica Neue',
            fontWeight: "bold",
            fontSize: fontSize,
            fill: fontColor //0x343337
        });

        letter.alpha = 0;
        letter.x = x;
        letter.y = 939 + yOffset;
        letter.resolution = 2;

        container.addChild(letter);

        gsap.to(letter, {
            alpha: 1,
            duration: 0.1,
            delay: i * delayStep
        });

        x += letter.width + 2;
    }
}


// Helper: animate wipe-out effect
function wipeOutHeadline(container) {
    return new Promise(resolve => {
        const children = container.children;
        const totalDuration = 0.2;
        const delayStep = totalDuration / container.children.length;

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

function wipeOutTopLine(container) {
    return new Promise(resolve => {
        const children = container.children;
        const totalDuration = 0.2;
        const delayStep = totalDuration / container.children.length;

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
            })
        })
    })
}

function wipeOutBottomLine(container) {
    return new Promise(resolve => {
        const children = container.children;
        const totalDuration = 0.2;
        const delayStep = totalDuration / container.children.length;

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
            })
        })
    })
}

async function wipeOutLeftNewsTab(container) {
    return new Promise(resolve => {
        const children = container.children;
        const totalDuration = 0.2;
        const delayStep = totalDuration / container.children.length;

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
            })
        })
    })
}

export class Strap {
    STATES = Object.freeze({
        OFF: 0,
        HEADLINE: 1,
        ONE_LINE: 2,
        TWO_LINE: 3,

        BREAKING_BILLBOARD: 4, //basically HEADLINE strap that just says "BREAKING NEWS"
        BREAKING_TEXT: 5, //breaking news themed Two Line strap with content
    });

    breakingStrapImgSequence = [];
    breakingRingImgSequence = [];

    leftNewsTabIn = false;


    currentState = this.STATES.OFF;

    constructor(app) {
        this.app = app;

        this.init();

        vizEvents.on('strap:out', () => this.out());
    }

    async init() {

        this.pendingHeadlineUpdate = null;

        this.ctr = new PIXI.Container();
        this.ctr.label = "Strap";
        this.ctr.y = 112;
    
        this.createLoadingIndicator(); 
    
        this.createBacking();
        this.createMask();

        
    
        this.textContainer = new PIXI.Container();
        this.topLineContainer = new PIXI.Container();
        this.bottomLineContainer = new PIXI.Container();
    
    
        this.app.stage.addChild(this.ctr);

        this.createLeftNewsTab();

    

        
        await Promise.all([
            this.setupBreakingLoop(),
            this.setupBreakingRingAnim()
        ]);
        this.ctr.addChild(this.breakingStrapSprite);
    
        this.createBreakingForegroundWipe() 
        this.ctr.addChild(this.breakingRingSprite);

        this.ctr.addChild(this.textContainer);
        this.ctr.addChild(this.topLineContainer);
        this.ctr.addChild(this.bottomLineContainer);

    
        this.app.stage.removeChild(this.loadingContainer);
    }
    

    createLoadingIndicator() {
        this.loadingContainer = new PIXI.Container();
        this.loadingText = new PIXI.Text("Loading Breaking Animations\nPlease wait...", {
            fontFamily: 'Helvetica',
            fontSize: 50,
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: 'bold',
        });
        this.loadingText.anchor = { x: 0.5, y: 0.5 };
        this.loadingText.x = 1920 / 2;
        this.loadingText.y = 1080 / 2;
    
        this.loadingContainer.addChild(this.loadingText);
        this.app.stage.addChild(this.loadingContainer);
    
        gsap.to(this.loadingText, {
            alpha: 0.2,
            duration: 0.6,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    }
    createBreakingForegroundWipe() {
        this.breakingForegroundWipe = new PIXI.Graphics();
        this.breakingForegroundWipe.y = 879; // Same as strap
        this.breakingForegroundWipe.visible = false;
    
        this.ctr.addChild(this.breakingForegroundWipe);
    }
    
    async animateBreakingForegroundWipeIn(width = 1920, height = 112, steps = 20, color = 0x8c0000) {
        this.breakingForegroundWipe.visible = true;
        this.breakingForegroundWipe.alpha = 1;
        this.breakingForegroundWipe.clear();
    
        const stepWidth = width / steps;
    
        for (let i = 0; i <= steps; i++) {
            // Draw step
            
            this.breakingForegroundWipe.rect(0, 0, stepWidth * i, height);
            this.breakingForegroundWipe.fill({color: color, alpha: i / steps});
    
            // Delay between steps
            await new Promise(res => setTimeout(res, 20));
        }
    }

    async animateBreakingForegroundWipeOut(width = 1920, height = 112, steps = 20) {
        const stepWidth = width / steps;
    
        // Ensure it's visible and fully drawn red
        this.breakingForegroundWipe.visible = true;
        this.breakingForegroundWipe.clear();
        this.breakingForegroundWipe.beginFill(0x8c0000);
        this.breakingForegroundWipe.drawRect(0, 0, width, height);
        this.breakingForegroundWipe.endFill();
    
        for (let i = 0; i <= steps; i++) {
            this.breakingForegroundWipe.clear();
            this.breakingForegroundWipe.beginFill(0x8c0000);
            this.breakingForegroundWipe.drawRect(stepWidth * i, 0, width - stepWidth * i, height);
            this.breakingForegroundWipe.endFill();
    
            await new Promise(res => setTimeout(res, 20));
        }
    
        this.breakingForegroundWipe.visible = false;
    }
    
    

    async setupBreakingRingAnim() {
        const loadPromises = [];
        for (let i = 0; i < 28; i++) {
            loadPromises.push(PIXI.Assets.load(`RINGANIM/RING_${i.toString().padStart(5, '0')}.png`));
        }

        this.breakingRingImgSequence = await Promise.all(loadPromises);

        this.breakingRingSprite = new PIXI.AnimatedSprite(this.breakingRingImgSequence);

        //50fps anim
        this.breakingRingSprite.animationSpeed = 0.83;
        this.breakingRingSprite.loop = false;
        this.breakingRingSprite.visible = false;
        this.breakingRingSprite.y = 879;
        
    }

    async setupBreakingLoop() {
        const loadPromises = [];
        for (let i = 0; i < 1250; i++) {
            loadPromises.push(PIXI.Assets.load(`BREAKING_LOOP/LOOP_${i.toString().padStart(5, '0')}.jpg`));
        }
        this.breakingStrapImgSequence = await Promise.all(loadPromises);

        this.breakingStrapSprite = new PIXI.AnimatedSprite(this.breakingStrapImgSequence);

        //50fps anim
        this.breakingStrapSprite.animationSpeed = 0.83;
        this.breakingStrapSprite.loop = true;
        this.breakingStrapSprite.visible = false;
        this.breakingStrapSprite.y = 879;
        this.breakingStrapSprite.play();
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

    createLeftNewsTab()
    {
       this.leftNewsTabContainer = new PIXI.Container();
       this.leftNewsTabContainer.label = "Left News Tab";
       this.leftNewsTabContainer.x = -735;
       this.leftNewsTabContainer.y = 0;
       this.leftNewsTab = new PIXI.Graphics();
       this.leftNewsTab.rect(0, 946, 735, 45);
       this.leftNewsTab.fill(0x8b0000);
       this.leftNewsTab.alpha = 1;

       this.app.stage.addChild(this.leftNewsTabContainer);
       this.leftNewsTabContainer.addChild(this.leftNewsTab);
    }

    async showHeadline(text) {
        this.pendingHeadlineUpdate = text;
        setTimeout(() => {
            if (this.pendingHeadlineUpdate === text) {
                this.pendingHeadlineUpdate = null;
            }
        }, 500); // clear after 0.5s just in case
            
        if (this.currentState === this.STATES.HEADLINE) {
            this.pendingHeadlineUpdate = text;
    
            await wipeOutHeadline(this.textContainer);
            await renderHeadlineWipeIn(this.textContainer, text, 1300, 95, 0x8b0000);
            
            this.pendingHeadlineUpdate = null;
            console.log("Headline update complete");
            return;
        }

        if (this.currentState === this.STATES.ONE_LINE) {
            await wipeOutTopLine(this.topLineContainer);
        }
        if (this.currentState === this.STATES.TWO_LINE) {
            wipeOutTopLine(this.topLineContainer);
            await new Promise(resolve => setTimeout(resolve, 200));
            await wipeOutBottomLine(this.bottomLineContainer);
            

        }

        await vizEvents.emit('tile:out');
        

        this.currentState = this.STATES.HEADLINE;

        const anim = newAnimWithDevTools("Strap In");

        return new Promise(resolve => {
            setTimeout(async () => {
                await renderHeadlineWipeIn(this.textContainer, text, 1400, 95, 0x8b0000); // maxWidth, fontSize 0x8b0000
                resolve();
            }, 500);
            anim.to(this.ctr, {
                y:0,
                duration: 0.7,
                ease: "sine.out",
                
            });
            anim.to(this.leftNewsTabContainer, 
                {
                    y: -112,
                    duration: 0.7,
                    ease: "sine.out",
                }, "<"
            );
            
        });
    }

    async showBreakingBillboard(text) {
        if (this.currentState === this.STATES.BREAKING_BILLBOARD) {
            await wipeOutHeadline(this.textContainer);
            if(text === "BREAKING NEWS" )
            {
                this.breakingRingSprite.gotoAndPlay(0);
            }
            await renderHeadlineWipeIn(this.textContainer, text, 1300, 95, 0xFFFFFF);
            return;
        }
    
        // Clear out other strap types
        if (this.currentState === this.STATES.HEADLINE) {
            await wipeOutHeadline(this.textContainer);
        }
        if (this.currentState === this.STATES.ONE_LINE) {
            await wipeOutTopLine(this.topLineContainer);
        }
        if (this.currentState === this.STATES.TWO_LINE) {
            await wipeOutTopLine(this.topLineContainer);
            await new Promise(resolve => setTimeout(resolve, 200));
            await wipeOutBottomLine(this.bottomLineContainer);
        }
    
        await vizEvents.emit('tile:out');
    
        this.currentState = this.STATES.BREAKING_BILLBOARD;
        this.breakingStrapSprite.visible = true;
        this.breakingRingSprite.visible = true;
    
        this.breakingForegroundWipe.visible = true;
        this.breakingForegroundWipe.clear();
        this.breakingForegroundWipe.beginFill(0x8c0000);
        this.breakingForegroundWipe.drawRect(0, 0, 1920, 112);
        this.breakingForegroundWipe.endFill();
    
        const anim = newAnimWithDevTools("Strap In");
    
        return new Promise(resolve => {
            anim.to(this.ctr, {
                y: 0,
                duration: 0.7,
                ease: "sine.out",
                onComplete: async () => {
                    this.animateBreakingForegroundWipeOut();
    
                    if (text === "BREAKING NEWS") {
                        this.breakingRingSprite.gotoAndPlay(0);
                    }
                    await renderHeadlineWipeIn(this.textContainer, text, 1400, 95, 0xFFFFFF);
                    resolve();
                }
            });
            anim.to(this.leftNewsTabContainer, 
                {
                    y: -112,
                    duration: 0.7,
                    ease: "sine.out",
                }, "<"
            );
        });
    }
    

    async showBreakingText(topLineText, bottomLineText) {
        if (this.currentState === this.STATES.ONE_LINE) {
            await wipeOutTopLine(this.topLineContainer);
        }
    
        if (this.currentState === this.STATES.HEADLINE) {
            await wipeOutHeadline(this.textContainer);
        }
    
        if (this.currentState === this.STATES.TWO_LINE) {
            await wipeOutTopLine(this.topLineContainer);
            await new Promise(resolve => setTimeout(resolve, 200));
            await wipeOutBottomLine(this.bottomLineContainer);
        }

        if(this.currentState === this.STATES.OFF)
        {
            await this.showBreakingBillboard("BREAKING NEWS");
            await new Promise(resolve => setTimeout(resolve, 700));
            
        }
        
        
        await vizEvents.emit('tile:out');
        await wipeOutHeadline(this.textContainer);
        this.showLeftNewsTab("BREAKING NEWS",0xFFFFFF,0x8C0000, true);
        await this.animateBreakingForegroundWipeIn();

    
        this.currentState = this.STATES.BREAKING_TEXT;
    
        const anim = newAnimWithDevTools("Strap In");


        await renderTopLineWipeIn(this.topLineContainer, topLineText, 1400, 48, 0xFFFFFF);
        await renderBottomLineWipeIn(this.bottomLineContainer, bottomLineText, 1400, 42, 0xFFFFFF);
        return new Promise(resolve => {
            resolve();
        });
     
    }
    


    async showOneLine(text) {
        if (this.currentState === this.STATES.ONE_LINE)
        {
            await wipeOutTopLine(this.topLineContainer);
            await renderTopLineWipeIn(this.topLineContainer, text, 1400, 48);
            return;
        }

        if (this.currentState === this.STATES.TWO_LINE) {
            wipeOutTopLine(this.topLineContainer);
            await new Promise(resolve => setTimeout(resolve, 200));
            await wipeOutBottomLine(this.bottomLineContainer);
        }

        if (this.currentState === this.STATES.HEADLINE) {
            await wipeOutHeadline(this.textContainer);
        }
        
        await vizEvents.emit('tile:out');

        this.currentState = this.STATES.ONE_LINE;

        const anim = newAnimWithDevTools("Strap In");

        return new Promise(resolve => {
         
            anim.to(this.ctr, {
                y:53.5,
                duration: 0.7,
                ease: "sine.out",
                onComplete: async () => {
                    await renderTopLineWipeIn(this.topLineContainer, text, 1400, 48); // maxWidth, fontSize
                resolve();
                }
            });
            anim.to(this.leftNewsTabContainer, 
                {
                    y: -58.5,
                    duration: 0.7,
                    ease: "sine.out",
                }, "<");
        })
    }

    async showTwoLine(topLineText, bottomLineText) {

        let duration = 0.7;

        if (this.currentState === this.STATES.ONE_LINE)
        {
            await wipeOutTopLine(this.topLineContainer);

        }

        if (this.currentState === this.STATES.HEADLINE) {
            await wipeOutHeadline(this.textContainer);
            duration = 0;

        }
        if (this.currentState === this.STATES.TWO_LINE) {
            wipeOutTopLine(this.topLineContainer);
            await new Promise(resolve => setTimeout(resolve, 200));
            await wipeOutBottomLine(this.bottomLineContainer);
            
            duration = 0;
        }

        await vizEvents.emit('tile:out');
        
        this.currentState = this.STATES.TWO_LINE;

        const anim = newAnimWithDevTools("Strap In");

        return new Promise(resolve => {
         
            anim.to(this.ctr, {
                y:0,
                duration: duration,
                ease: "sine.out",
                onComplete: async () => {
                    await renderTopLineWipeIn(this.topLineContainer, topLineText, 1400, 48); // maxWidth, fontSize
                    await new Promise(resolve => setTimeout(resolve, 200));
                    await renderBottomLineWipeIn(this.bottomLineContainer, bottomLineText, 1400, 43); // maxWidth, fontSize
                    resolve();
                }
            });

            anim.to(this.leftNewsTabContainer, 
                {
                    y: -112,
                    duration: 0.7,
                    ease: "sine.out",
                }, "<"
            );
        })
    }

    async showLeftNewsTab(text, backColor, foreColor, fullWidthBar) {
        if(this.leftNewsTabIn)
        {
            await this.hideLeftNewsTab();
        }
    
        this.leftNewsTabIn = true;
    
        this.leftNewsTab.clear();
    
        this.leftNewsTabWidth = 735; // default full width
        if (!fullWidthBar) {
            //measure text width
            const tempText = new PIXI.Text(text, {
                fontFamily: 'Helvetica Neue',
                fontWeight: "bold",
                fontSize: 40,
                fill: foreColor
            });
            
            this.leftNewsTabWidth = 285 + tempText.width + 20;
        }
    
        this.leftNewsTab.rect(0, 946, this.leftNewsTabWidth, 45);
    
        this.leftNewsTab.fill(backColor);
    
        const anim = newAnimWithDevTools("Left News Tab In");
    
        return new Promise(resolve => {
            anim.to(this.leftNewsTabContainer, {
                x:0,
                duration: 0.7,
                ease: "sine.out",
                onComplete: async () => {
                    await renderLeftNewsTabWipeIn(this.leftNewsTab, text, this.leftNewsTabWidth - 295, 40, foreColor);
                    resolve();
                }
            })
        });
    }

    async hideLeftNewsTab() {
        if(!this.leftNewsTabIn)
        {
            return;
        }

        this.leftNewsTabIn = false;

        await wipeOutLeftNewsTab(this.leftNewsTab);

        const anim = newAnimWithDevTools("Left News Tab Out");

        return new Promise(resolve => {
            anim.to(this.leftNewsTabContainer, {
                x:-this.leftNewsTabWidth,
                duration: 0.7,
                ease: "sine.in",
                onComplete: async () => {
                    this.leftNewsTab.clear();
                    this.leftNewsTab.rect(0, 946, 735, 45);
                    this.leftNewsTab.fill(0x8b0000);
                    this.leftNewsTabContainer.x = -735;
                    
                    resolve();
                }
            })
        })
    }

    async out() {
        console.log("9")
        if (this.currentState === this.STATES.OFF) return;
        RemoveFromGraphicsStatus("HEAD")

        if (this.pendingHeadlineUpdate && this.currentState === this.STATES.HEADLINE) {
            // skip full out — a new headline is about to replace this one
            return;
        }

        if (this.currentState === this.STATES.HEADLINE) {
            await wipeOutHeadline(this.textContainer);
        }

        if (this.currentState === this.STATES.ONE_LINE) {
            await wipeOutTopLine(this.topLineContainer);
        }

        if (this.currentState === this.STATES.TWO_LINE) {
            wipeOutTopLine(this.topLineContainer);
            await new Promise(resolve => setTimeout(resolve, 200));
            await wipeOutBottomLine(this.bottomLineContainer);
        }

        if (this.currentState === this.STATES.BREAKING_BILLBOARD) {
            await wipeOutHeadline(this.textContainer);
        }

        if (this.currentState === this.STATES.BREAKING_TEXT) {
            this.hideLeftNewsTab();
            wipeOutTopLine(this.topLineContainer);
            await new Promise(resolve => setTimeout(resolve, 200));
            await wipeOutBottomLine(this.bottomLineContainer);

        }
        

        const anim = newAnimWithDevTools("Strap Out");

        return new Promise(resolve => {
            anim.to(this.ctr, {
                y: 112,
                duration: 0.7,
                ease: "sine.out",
                onComplete: () => {
                    if
                        (this.currentState === this.STATES.BREAKING_BILLBOARD || 
                        this.currentState === this.STATES.BREAKING_TEXT)
                    {
                        this.breakingForegroundWipe.clear();
                        this.breakingForegroundWipe.visible = false;
                        this.breakingRingSprite.visible = false;
                        this.breakingStrapSprite.visible = false;
                        
                    }

                    RemoveFromGraphicsStatus("[STRAP]");
                    this.currentState = this.STATES.OFF;
                    console.log("6")
                    resolve();
                }
            });
            anim.to(this.leftNewsTabContainer,
                {
                    y: 0,
                    duration: 0.7,
                    ease: "sine.out",
                }, "<"
            );
        });
    }
}
