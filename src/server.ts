import { CONDITION_NOT_FOUND, IS_STUDY } from "./constants";
import { Global } from "./Global";

export class Server {
  public static getCondition(callback: (condition: string) => void) {
    if (!IS_STUDY) {
      callback(CONDITION_NOT_FOUND);
      return;
    }

    fetch("/condition", {
      method: "POST",
    })
      .then((response) => {
        if (response.status === 200) {
          response.text().then((body) => {
            callback(body);
          });
        } else {
          callback(CONDITION_NOT_FOUND);
        }
      })
      .catch(() => {
        callback(CONDITION_NOT_FOUND);
      });
  }

  public static submitAttempt() {
    if (!IS_STUDY) return;

    const submission = {
      diedFrom: Global.diedFrom,
      "stamina-left": Global.staminaLeft,
      time: Global.time,
      won: Global.playerWon,
      order: Global.order,
      playerID: Global.playerID,
      levels: Global.levels,
      director: Global.director,
    };

    fetch("/log", {
      method: "POST",
      body: JSON.stringify(submission),
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      console.log(response.status);
      console.log(response);
    });
  }
}
