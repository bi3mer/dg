import { Graph } from "./GDM-TS";
import { CustomNode } from "./customNode";
import { ILevelDirector } from "./ILevelDirector";
import { CustomEdge } from "./customEdge";
import { NUM_ROWS } from "./constants";

function bfs(mdp: Graph, start: string, end: string) {
  let queue: string[] = [start];
  let cameFrom: { [key: string]: string } = {};

  while (queue.length > 0) {
    let state = queue.shift()!;

    if (state === end) {
      // reconstruct path and return
      let path: string[] = [end];
      let curState = end;
      while (curState !== start) {
        curState = cameFrom[curState];
        path.push(curState);
      }

      return path.reverse();
    }

    for (let nextState of mdp.neighbors(state)) {
      if (nextState in cameFrom) continue;

      cameFrom[nextState] = state;
      queue.push(nextState);
    }
  }

  return [];
}

export class StaticLevelDirector implements ILevelDirector {
  public playerIsOnLastLevel: boolean = false;

  private keys: string[];
  private mdp: Graph;
  private index: number = 0;
  private path: string[];

  constructor(mdp: Graph) {
    this.mdp = mdp;

    this.path = bfs(mdp, "start", "end");
    this.path.shift(); // remove "start" node
  }

  playerOnLastLevel(): boolean {
    return this.playerIsOnLastLevel;
  }

  public update(playerWon: boolean, playerColumn: number): void {
    if (playerWon) {
      this.index += this.keys.length;
    }
  }

  public get(levelSegments: number): string[] {
    this.playerIsOnLastLevel = false;

    this.keys = [];
    for (let i = 0; i < levelSegments; ++i) {
      this.keys.push(this.path[i + this.index]);

      if (this.keys[i].includes("end")) {
        this.playerIsOnLastLevel = true;
        break;
      }
    }

    console.log(this.keys);

    // Populate the level
    const lvl: string[] = Array(NUM_ROWS).fill("");
    const length = this.keys.length;

    for (let i = 0; i < length; ++i) {
      if (i > 0) {
        const edge = this.mdp.getEdge(this.keys[i - 1], this.keys[i]);
        if (edge instanceof CustomEdge) {
          const link = (edge as CustomEdge).link;
          if (link.length > 0) {
            for (let r = 0; r < NUM_ROWS; ++r) {
              lvl[r] += link[r];
            }
          }
        }
      }

      const stateLVL = (this.mdp.getNode(this.keys[i]) as CustomNode).level;

      for (let r = 0; r < NUM_ROWS; ++r) {
        lvl[r] += stateLVL[r];
      }

      if (this.keys[i].includes("end")) {
        break;
      }
    }

    return lvl;
  }
}
