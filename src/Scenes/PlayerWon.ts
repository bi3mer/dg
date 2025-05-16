import { IS_STUDY } from "../constants";
import { Global } from "../Global";
import { Engine, Scene, Key, Utility } from "../WorldEngine";

export class PlayerWon extends Scene {
  public sceneIndex: number = 0;
  public timer: number = 0;

  constructor() {
    super();
  }

  public onEnter(engine: Engine): void {
    this.timer = 0;
  }

  public onExit(engine: Engine): void {}

  public update(engine: Engine): number {
    this.timer += engine.delta;
    if (this.timer > 2 || engine.keyDown.has(Key.ENTER)) {
      if (engine.getBB("last level")) {
        engine.shutoff();

        if (IS_STUDY) {
          document.getElementById("time")!.style.display = "none";
          document.getElementById("game")!.style.display = "none";
          document.getElementById("instructions")!.style.display = "inline";

          document.getElementById("instructions")!.innerHTML = `
            You beat the game, nice job! Please continue to the survey:
            <br/>
            <a
                style="color: yellow"
                href="https://neu.co1.qualtrics.com/jfe/form/SV_8H22NmUsm0OLxR4?userid=${Global.playerID}"
                >https://neu.co1.qualtrics.com/jfe/form/SV_8H22NmUsm0OLxR4?userid=${Global.playerID}</a
            >`;
        } else {
          alert("You beat the game, nice job!");
        }

        return -1;
      } else {
        Utility.Cookie.set(engine.getBB("level"), "b");
        return this.sceneIndex;
      }
    } else {
      engine.setFont(40);
      engine.drawText(420, 240, "You won!", "green");
      return -1;
    }
  }
}
