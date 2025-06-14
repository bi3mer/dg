import { Graph, policyIteration } from "./GDM-TS";
import { Edge } from "./GDM-TS/src/Graph/edge";
import { choice } from "./GDM-TS/src/rand";
import { KEY_DEATH, KEY_START, NUM_ROWS, KEY_END } from "./constants";
import { CustomNode } from "./customNode";
import { CustomEdge } from "./customEdge";
import { ILevelDirector } from "./ILevelDirector";

export class MDPLevelDirector implements ILevelDirector {
  public playerIsOnLastLevel: boolean = false;
  public keys: string[] = [];

  private columnsPerLevel: number[] = [];
  private playerWonLastRound: boolean = false;
  private lossesInARow: number = 0;

  constructor(private mdp: Graph) {}

  playerOnLastLevel(): boolean {
    return this.playerIsOnLastLevel;
  }

  public update(playerWon: boolean, playerColumn: number): void {
    // Map out how far the player made it in the level
    const keysLength = this.keys.length;
    const percentCompleted: number[] = [];
    if (playerWon) {
      for (let i = 0; i < keysLength; ++i) {
        percentCompleted.push(1);
      }

      this.lossesInARow = 0;
    } else {
      let col = playerColumn;
      for (let i = 0; i < keysLength; ++i) {
        if (col > this.columnsPerLevel[i]) {
          percentCompleted[i] = 1;
          col -= this.columnsPerLevel[i];
        } else {
          percentCompleted[i] = col / this.columnsPerLevel[i];
          break;
        }
      }
    }

    // Update baed on how the player did
    const pcLength = percentCompleted.length;
    for (let i = 0; i < pcLength; ++i) {
      const pc = percentCompleted[i];
      const id = this.keys[i];
      const node = this.mdp.getNode(id) as CustomNode;

      // add edge if the segemnt was completed by the player
      if (pc === 1) {
        if (!this.mdp.hasEdge(KEY_START, id)) {
          this.mdp.addDefaultEdge(KEY_START, id, [
            [id, 1],
            [KEY_DEATH, 0.0],
          ]);
        }
      }

      // update reward based on how the player did
      ++node.visitedCount;
      node.sumPercentCompleted += pc;
      node.updateReward();

      // update incoming edges life and death probability
      const probLife = node.sumPercentCompleted / node.visitedCount;
      const probDeath = 1 - probLife;
      this.mdp.mapEdges((e: Edge) => {
        if (e.tgt === id) {
          // There are always two entries. First is ideal target state and the
          // second is death.
          e.probability[0][1] = probLife;
          e.probability[1][1] = probDeath;
        }
      });
    }

    // This is the adaptive part of of adaptive policy iteration. See my
    // see my ADP paper (Level Assembly as a Markov Decision Process) for details.
    // Note that instead of reward or difficulty, we are concerned with maintaining
    // the structure of this smaller graph, so we use the depth of the node.
    if (!playerWon) {
      ++this.lossesInARow;

      // Only start removing edges lost at least 2 times in a row
      for (let i = 0; i < this.lossesInARow - 1; ++i) {
        const neighbors = this.mdp.getNode(KEY_START).neighbors;
        const neighborsCount = neighbors.length;

        if (neighborsCount === 1) {
          break;
        }

        let hardestNeighbor = "";
        let maxDepth = -10000;
        for (let jj = 0; jj < neighborsCount; ++jj) {
          const nodeName = neighbors[jj];
          const d = (this.mdp.getNode(nodeName) as CustomNode).depth;
          if (d > maxDepth) {
            hardestNeighbor = nodeName;
            maxDepth = d;
          }
        }

        console.log("removing edge:", hardestNeighbor, maxDepth);
        this.mdp.removeEdge(KEY_START, hardestNeighbor);
      }
    }

    this.playerWonLastRound = playerWon;
  }

  public get(levelSegments: number): string[] {
    this.playerIsOnLastLevel = false;

    let pi = policyIteration(this.mdp, 0.95, true, true, 20);
    this.columnsPerLevel = [];

    // If player won, don't start from a level that they have definitely
    // already played
    if (this.playerWonLastRound) {
      this.keys = [choice(pi[KEY_START])];
    } else {
      this.keys = [KEY_START];
    }

    // USE MDP to create a policy and generate a new level
    for (let i = 0; i < levelSegments; ++i) {
      const k = choice(pi[this.keys[i]]);
      this.keys.push(k);

      if (k.includes(KEY_END)) {
        this.playerIsOnLastLevel = true;
        break;
      }
    }

    // remove START id from keys since we won't use it after this
    this.keys.splice(0, 1);

    for (let i = 0; i < this.keys.length; ++i) {
      const K = this.keys[i];
      const N = this.mdp.getNode(K);
      console.log(`${K}: ${N.reward}, ${N.utility}`);
    }
    console.log(this.keys);

    // Populate the level
    let r: number;
    const lvl: string[] = Array(NUM_ROWS).fill("");
    const length = this.keys.length;

    for (let i = 0; i < length; ++i) {
      // skip the start key
      const stateLVL = (
        this.mdp.getNode(this.keys[i]) as CustomNode
      ).level.slice(); // copy by value

      // add link if necessary. Note, we add it to state level so columnsPerLevel
      // is correct
      if (i > 0) {
        const edge = this.mdp.getEdge(this.keys[i - 1], this.keys[i]);
        if (edge instanceof CustomEdge) {
          const link = edge.link;
          const linkLength = link.length;
          if (linkLength > 0) {
            for (r = 0; r < NUM_ROWS; ++r) {
              stateLVL[r] = link[r] + stateLVL[r];
            }
          }
        }
      }

      this.columnsPerLevel.push(stateLVL[0].length);
      for (r = 0; r < NUM_ROWS; ++r) {
        lvl[r] += stateLVL[r];
      }
    }

    // This is nice for debugging, but not strictly necessary in the final product
    console.log(lvl.join("\n"));

    return lvl;
  }
}
