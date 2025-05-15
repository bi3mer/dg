import { Node } from "./GDM-TS/src/Graph/node";

export class CustomNode extends Node {
  public visitedCount: number;
  public sumPercentCompleted: number;

  private designerReward: number;

  constructor(
    name: string,
    reward: number,
    utility: number,
    isTerminal: boolean,
    neighbors: string[],
    public level: string[],
    public depth: number,
  ) {
    super(name, reward, utility, isTerminal, neighbors);

    this.designerReward = reward;

    this.visitedCount = 1;
    this.sumPercentCompleted = 1;
  }

  public updateReward(): void {
    this.reward = this.designerReward * this.visitedCount;
  }
}

// import { Node } from "./GDM-TS/src/Graph/node";

// export class CustomNode extends Node {
//   public visitedCount: number;
//   public sumPercentCompleted: number;
//   public depth: number;

//   public difficulty: number;
//   public enjoyability: number;

//   constructor(name: string, difficulty: number, enjoyability: number, utility: number, isTerminal: boolean, neighbors: string[], depth: number) {
//     super(name, difficulty, utility, isTerminal, neighbors);

//     this.difficulty = difficulty;
//     this.enjoyability = enjoyability;
//     this.depth = depth;

//     this.visitedCount = 1;
//     this.sumPercentCompleted = 1;
//   }

//   public updateReward(useDifficulty: boolean): void {
//     if (useDifficulty) {
//       this.reward = this.difficulty * this.visitedCount;
//     } else {
//       this.reward = this.enjoyability * this.visitedCount;
//     }
//   }
// }
