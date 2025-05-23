import { Node } from "./GDM-TS/src/Graph/node";

export class CustomNode extends Node {
  public visitedCount: number;
  public sumPercentCompleted: number;

  public designerReward: number;

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
