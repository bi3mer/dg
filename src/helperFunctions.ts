import { choice } from "./GDM-TS/src/rand";
import { ILevelDirector } from "./ILevelDirector";
import { AUTO_MDP } from "./autoMDP";
import { CONDITION_NOT_FOUND } from "./constants";
import { HAND_MDP } from "./handcraftedMDP";
import { MDPLevelDirector } from "./mdpLevelDirector";
import { StaticLevelDirector } from "./staticLevelDirector";

import { CustomNode } from "./customNode";
import { Global } from "./Global";

export function createLevelDirector(condition: string): ILevelDirector {
  if (condition === CONDITION_NOT_FOUND) {
    const CONDITIONS = ["auto-r", "auto-d", "static", "hand"];
    const params = new URLSearchParams(document.location.search);

    if (params.has("condition")) {
      const c = params.get("condition")!;
      if (CONDITIONS.includes(c)) {
        condition = c;
      } else {
        condition = choice(CONDITIONS);
      }
    } else {
      condition = choice(CONDITIONS);
    }
  }

  Global.condition = condition;
  if (condition === "auto-r") {
    console.log("Condition: auto-r");
    return new MDPLevelDirector(AUTO_MDP);
  } else if (condition === "auto-d") {
    console.log("Condition: auto-d");

    const maxDepth = (AUTO_MDP.nodes["end"] as CustomNode).depth - 1;
    for (const nodeName in AUTO_MDP.nodes) {
      if (nodeName !== "end") {
        const N = AUTO_MDP.nodes[nodeName] as CustomNode;
        N.designerReward = N.depth / maxDepth - 1;
        N.updateReward();
      }
    }

    return new MDPLevelDirector(AUTO_MDP);
  } else if (condition === "static") {
    console.log("Condition: static");
    return new StaticLevelDirector(AUTO_MDP);
  } else if (condition === "hand") {
    console.log("Condition: hand");
    return new MDPLevelDirector(HAND_MDP);
  }

  // no valid condition found, going with a random one
  return createLevelDirector(choice(["auto-r", "auto-d", "static", "hand"]));
}
