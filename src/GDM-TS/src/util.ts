import { Graph } from "./Graph/graph";
import type { Policy } from "./policy";
import { choice } from "./rand";

export function calculateUtility(G: Graph, src: string, tgt: string, gamma: number): number {
  const P = G.getEdge(src, tgt).probability;
  const size = P.length;
  let sum = 0;

  for (let i = 0; i < size; ++i) {
    const [nTgt, p] = P[i];
    sum += p * (G.reward(nTgt) + gamma * G.utility(nTgt));
  }

  return sum;
}

export function calculateMaxUtility(G: Graph, n: string, gamma: number): number {
  const node = G.getNode(n);
  if (node.isTerminal) {
    return 0;
  }

  const neighbors = node.neighbors;
  const size = neighbors.length;
  let max = -Infinity;

  for (let i = 0; i < size; ++i) {
    max = Math.max(max, calculateUtility(G, n, neighbors[i], gamma));
  }

  return max;
}

export function resetUtility(G: Graph): void {
  for (const n in G.nodes) {
    G.nodes[n].utility = 0;
  }
}

export function createRandomPolicy(G: Graph): Policy {
  const pi: Policy = {};
  for (const n in G.nodes) {
    if (!G.getNode(n).isTerminal) {
      pi[n] = [...G.neighbors(n)]; // shallow copy
    }
  }
  return pi;
}

export function createPolicy(G: Graph, gamma: number): Policy {
  const pi: Policy = {};
  for (const n in G.nodes) {
    if (G.getNode(n).isTerminal) {
      continue;
    }

    let bestU = -Infinity;
    let bestN: string[] = [];

    for (const np of G.neighbors(n)) {
      const u = calculateUtility(G, n, np, gamma);
      if (u === bestU) {
        bestN.push(np);
      } else if (u > bestU) {
        bestU = u;
        bestN.length = 0; // clear the array
        bestN.push(np);
      }
    }

    pi[n] = bestN;
  }

  return pi;
}

export function runPolicy(G: Graph, start: string, pi: Policy, maxSteps: number): [string[], number[]] {
  const states: string[] = [start];
  const rewards: number[] = [G.nodes[start].reward];
  let curState = start;
  for (let i = 0; i < maxSteps; i++) {
    if (G.nodes[curState].isTerminal) {
      break;
    }

    let tgtState = choice(pi[curState]);
    let p = Math.random();

    for (const [nextState, probability] of G.getEdge(curState, tgtState).probability) {
      if (p <= probability) {
        tgtState = nextState;
        break;
      } else {
        p -= probability;
      }
    }

    states.push(tgtState);
    rewards.push(G.nodes[tgtState].reward);
    curState = tgtState;
  }

  return [states, rewards];
}

