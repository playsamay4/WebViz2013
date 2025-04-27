import { initializeWebSocket, AddToGraphicsStatus, OverlayGraphicsStatus, RemoveFromGraphicsStatus} from './utils/websocket.js';


import { Logo } from "./components/Logo.js";
import { Ticker } from "./components/Ticker.js";
import { Tile } from "./components/Tile.js";
import { Strap } from "./components/Strap.js";
import { getTimeStr } from "./utils/textUtils.js";

window.devToolsEnabled = false;
var strapColor = {color: 0xb80000, alpha: 1};
//var strapColor = {color: 0x000000, alpha: 0.8}

const ws = initializeWebSocket();
if (ws) {
    window.ws = ws;
}


// Create a PixiJS application.
const app = new PIXI.Application();
globalThis.__PIXI_APP__ = app;

// Intialize the application.
await app.init({ antialias: true, backgroundAlpha:0 , resizeTo: window, width: 1920, height: 1080 });

//PIXI.Assets.addBundle('fonts', []); await PIXI.Assets.loadBundle('fonts');


const templateTexture = await PIXI.Assets.load('head.png');
const template = new PIXI.Sprite(templateTexture); template.alpha = 1;
app.stage.addChild(template);


let logoComponent = new Logo(app);
let tickerComponent = new Ticker(app); window.tickerComponent = tickerComponent;
let tileComponent = new Tile(app, "uk");
let strapComponent = new Strap(app);




document.body.appendChild(app.canvas);
document.body.style.margin = 0; // remove default margin

const keyActionMap = new Map([
    ['d', () => { template.alpha = template.alpha ? 0 : 1; }],
    
    ['q', () => logoComponent.logoIn()],
    ['w', () => tickerComponent.tickerIn()],
    ['e', () => logoComponent.logoOut()],
    ['r', () => tickerComponent.tickerOut()],

    ['a', () => tileComponent.in()],
    ['s', () => tileComponent.out()],

    ['z', () => strapComponent.showHeadline("TRUMP VISITS BORDER")],
    ['x', () => strapComponent.out()],


]);
  
document.addEventListener('keydown', (event) => {
const action = keyActionMap.get(event.key);
if (action) {
    action();
}
});


//every second, update the clock
setInterval(function()
{
    logoComponent.setClockTime(getTimeStr());

        //Send back the status to the server
    if(ws && ws.readyState === WebSocket.OPEN)
    {

        ws.send(JSON.stringify({type: "GRAPHICS STATUS", data: JSON.stringify(OverlayGraphicsStatus)}));
    } 
}, 1000);

const messageHandlers = {
    "[ALL OFF]": () => {
      logoComponent.logoOut();
      tickerComponent.tickerOut();
      tileComponent.out();
    },
    "[LOGO ON]": (msg) => {
      logoComponent.logoIn();
      AddToGraphicsStatus(msg.overlayType, "[LOGO ON]", msg.data);
    },
    "[LOGO OFF]": () => {
      logoComponent.logoOut();
      RemoveFromGraphicsStatus("[LOGO ON]");
    },
    "[LOGO ON]{OUT}": () => {
      logoComponent.logoOut();
      RemoveFromGraphicsStatus("[LOGO ON]");
    },
    "[LOWERTHIRD ON]": (msg) => {
      logoComponent.logoIn();
      AddToGraphicsStatus(msg.overlayType, "[LOGO ON]", msg.data);
    },
    "[LOWERTHIRD OFF]": () => {
      logoComponent.logoOut();
      RemoveFromGraphicsStatus("[LOGO ON]");
    },
    "[TICKER ON]": (msg) => {
      tickerComponent.tickerIn();
      AddToGraphicsStatus(msg.overlayType, "[TICKER ON]", msg.data);
    },
    "[TICKER ON]{OUT}": (msg) => {
      tickerComponent.tickerIn();
      AddToGraphicsStatus(msg.overlayType, "[TICKER ON]", msg.data);
    },
    "[TICKER OFF]": () => {
      tickerComponent.tickerOut();
      RemoveFromGraphicsStatus("[TICKER ON]");
    },
    ".5": (msg) => {
      tileComponent.in();
      AddToGraphicsStatus(msg.overlayType, ".5", msg.data);
    },
    ".5{OUT}": () => {
      tileComponent.out();
      RemoveFromGraphicsStatus(".5");
    }
};
  
  window.parseMsg = async (evt) => {
    try {
      const received_msg = evt.data;
      console.log("Message received:", received_msg);
      const message = JSON.parse(received_msg);
      const handler = messageHandlers[message.type];
  
      if (handler) {
        handler(message);
      } else {
        console.warn("Unhandled message type:", message.type);
      }
    } catch (err) {
      console.error("Error parsing message:", err);
    }
  };
  


    

function openMenu()
{
    new WinBox("Controls", {
        html:
        `
    
        <button onclick="LowerThirdOut()">Lower Third Out</button>
        <button onclick="LowerThirdIn()">Lower Third In</button>
        </br>
        <button onclick="BeginTickerSequence()">Begin Ticker Sequence</button>
        </br>
        <input type="text" id="newsBarText" placeholder="News Bar Text">
        <button onclick="UpdateNewsBarText(document.getElementById('newsBarText').value)">Update News Bar Text</button>
    
        </br></br>
        <input type="text" id="twoLinerLine1" placeholder="Two Liner Line 1">
        <input type="text" id="twoLinerLine2" placeholder="Two Liner Line 2">
        </br>
        <button onclick="ShowTwoLiner(document.getElementById('twoLinerLine1').value, document.getElementById('twoLinerLine2').value)">Show Two Liner</button>
        <button onclick="HideTwoLiner()">Hide Two Liner</button>
    
        </br></br>
        <input type="text" id="oneLinerText" placeholder="One Liner Text">
        </br>
        <button onclick="ShowOneLiner(document.getElementById('oneLinerText').value)">Show One Liner</button>
        <button onclick="HideOneLiner()">Hide One Liner</button>
    
        </br></br>
        <button onclick="ClockOut()">Clock Out</button>
        <button onclick="ClockIn()">Clock In</button>
    
        </br></br>
        <button onclick="FlipperIn()">Flipper In</button>
        <button onclick="FlipperOut()">Flipper Out</button>
        <button onclick="FlipperAndLowerThirdIn()">Flipper in and Lowerthird In</button>
    
        </br></br>
        <button onclick="TileIn()">Tile In</button>
        <button onclick="TileOut()">Tile Out</button>
    
        </br></br>
        <button onclick="TextBadgeIn('COMING UP')">Text Badge In</button>
        <button onclick="TextBadgeOut()">Text Badge Out</button>
    
        </br></br>
        <input type="text" id="nameTwoLinerLine1" placeholder="Name Two Liner Line 1">
        <input type="text" id="nameTwoLinerLine2" placeholder="Name Two Liner Line 2">
        </br>
        <button onclick="ShowNameTwoLiner(document.getElementById('nameTwoLinerLine1').value, document.getElementById('nameTwoLinerLine2').value)">Show Name Two Liner</button>
        <button onclick="HideNameTwoLiner()">Hide Name Two Liner</button>
    
        </br></br>
        <input type="text" id="nameOneLinerLine1" placeholder="Name One Liner Line 1">  
        </br>
        <button onclick="ShowNameOneLiner(document.getElementById('nameOneLinerLine1').value)">Show Name One Liner</button>
        <button onclick="HideNameOneLiner()">Hide Name One Liner</button>
    
        </br></br>
        <input type="text" id="headlineOneLine" placeholder="Headline One Line">
        </br>
        <button onclick="HeadlineInOneLine(document.getElementById('headlineOneLine').value)">Headline In One Line</button>
        <button onclick="HeadlineOutOneLine()">Headline Out One Line</button>

        </br></br>
        <input type="text" id="programmeBadgeText" placeholder="Programme Badge Text">
        <input type="color" id="programmeBadgeBgColor" value="#000000">
        <input type="color" id="programmeBadgeFgColor" value="#ffffff">
        </br>
        <button onclick="ProgrammeBadgeIn(document.getElementById('programmeBadgeText').value, document.getElementById('programmeBadgeBgColor').value, document.getElementById('programmeBadgeFgColor').value)">Programme Badge In</button>
        <button onclick="ProgrammeBadgeOut()">Programme Badge Out</button>
        </br>
        <button onclick="toggleProgrammeBadge()">Toggle Programme Badge</button>
        </br></br>
        <input type="text" id="leftLiveBugLocatorText" placeholder="Left Live bug Locator text"> Clock Offset </input>  
        <input type="number" id="leftLiveBugClockOffset"  name="quantity" min="-24" max="24">Clock On/Off</input>
        
        <input type="checkbox" id="leftLiveBugClockOnOff" name="clockOnOff" value="clockOnOff">
        <button onclick="LeftLiveBugIn(document.getElementById('leftLiveBugLocatorText').value,document.getElementById('leftLiveBugClockOnOff').checked, parseInt(document.getElementById('leftLiveBugClockOffset').value))">Left Live Bug In</button>
        <button onclick="LeftLiveBugOut()">Left Live Bug Out</button>
        



        `,
        x: "900",
        y: "0",
        width: 800,
        height: 800,
        class: [ "no-min", "no-max", "no-full",  ]
    });
}

window.openMenu = openMenu; //openMenu();
window.gsap = gsap;
