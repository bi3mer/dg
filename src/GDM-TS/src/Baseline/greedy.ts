
import { Graph } from '../Graph/graph';
import type { Policy } from '../policy';

export function greedyPolicy(G: Graph): Policy {
  const pi: Policy = {};
  for (const node of Object.values(G.nodes)) {
    if (node.isTerminal) {
      continue;
    }

    let bestNeighbor: string[] = [];
    let bestReward = -Infinity;

    const neighbors = node.neighbors;
    const size = neighbors.length;

    for (let i = 0; i < size; ++i) {
      const name = neighbors[i];
      const r = G.reward(name);

      if (r === bestReward) {
        bestNeighbor.push(name);
      } else if (r > bestReward) {
        bestReward = r;
        bestNeighbor.length = 0; // clears the array
        bestNeighbor.push(name);
      }
    }

    pi[node.name] = bestNeighbor;
  }

  return pi;
}

