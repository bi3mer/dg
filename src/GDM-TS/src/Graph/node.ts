export class Node {
  name: string;
  reward: number;
  utility: number;
  isTerminal: boolean;
  neighbors: string[];

  constructor(name: string, reward: number, utility: number, is_terminal: boolean, neighbors: string[]) {
    this.name = name;
    this.reward = reward;
    this.utility = utility;
    this.isTerminal = is_terminal;
    this.neighbors = neighbors;
  }
}


