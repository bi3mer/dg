import { Engine } from "./WorldEngine";
import { Scene } from "./Scenes";
import { Global } from "./Global";
import { DB } from "./Database";
import { QUESTIONS } from "./questions";
import { fischerYatesShuffle } from "./Random";
import { IS_STUDY } from "./constants";

DB.init();

// -------------- Set up player id ---------------
if (
  location.hostname === "localhost" ||
  location.hostname === "127.0.0.1" ||
  location.hostname === ""
) {
  Global.playerID = "-1";
} else {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("id")) {
    Global.playerID = crypto.randomUUID();
  } else {
    Global.playerID = "-1";
  }
}

console.log(`Player ID: ${Global.playerID}`);

// -------------- Set up the engine --------------
const engine = new Engine();
engine.displayFPS = false;

const startScene = new Scene.StartMenu();
const gameScene = new Scene.Game();
const playerLostScene = new Scene.PlayerLost();
const playerWonScene = new Scene.PlayerWon();
const tutorialScene = new Scene.Tutorial();
const surveyScene = new Scene.Survey();

const startIndex = engine.addScene(startScene);
const gameIndex = engine.addScene(gameScene);
const lostIndex = engine.addScene(playerLostScene);
const wonIndex = engine.addScene(playerWonScene);
const tutorialIndex = engine.addScene(tutorialScene);
const surveyIndex = engine.addScene(surveyScene);

startScene.tutorialIndex = tutorialIndex;
startScene.gameIndex = gameIndex;
startScene.surveyIndex = surveyIndex;

gameScene.playerLostIndex = lostIndex;
gameScene.playerWonIndex = wonIndex;
gameScene.selfIndex = gameIndex;
gameScene.mainMenuIndex = startIndex;

playerLostScene.sceneIndex = gameIndex;
playerWonScene.sceneIndex = gameIndex;

tutorialScene.gameSceneIndex = gameIndex;

const timeField = document.getElementById("time")!;
if (!IS_STUDY) {
  timeField.style.display = "none";
  engine.start(undefined);
} else {
  let timeLeft = 60 * 10; // 10 minutes
  engine.start((dt) => {
    if (timeLeft > 0) {
      timeLeft -= dt;
      const minutes = Math.floor(timeLeft / 60);
      const seconds = Math.round(timeLeft - minutes * 60);
      timeField.innerHTML = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    } else {
      // time is over, change the scene
      engine.shutoff();

      document.getElementById("time")!.style.display = "none";
      document.getElementById("game")!.style.display = "none";
      document.getElementById("instructions")!.style.display = "inline";

      document.getElementById("instructions")!.innerHTML = `
        Please continue to the survey:
        <a
            style="color: yellow"
            href="https://neu.co1.qualtrics.com/jfe/form/SV_8H22NmUsm0OLxR4?userid=${Global.playerID}"
            >https://neu.co1.qualtrics.com/jfe/form/SV_8H22NmUsm0OLxR4?userid=${Global.playerID}</a
        >
        `;
    }
  });
}
