
import { Graph } from "../Graph/graph";
import type { Policy } from "../policy";
import { choice } from "../rand";
import { calculateUtility, calculateMaxUtility, createRandomPolicy, resetUtility, createPolicy } from "../util";


function modifiedInPlacePolicyEvaluation(G: Graph, pi: Policy, gamma: number, policyK: number): void {
  for (let i = 0; i < policyK; ++i) {
    for (const n in G.nodes) {
      const node = G.getNode(n);
      if (!node.isTerminal) {
        node.utility = calculateUtility(G, n, choice(pi[n]), gamma);
      }
    }
  }
}

function modifiedPolicyEvaluation(G: Graph, pi: Policy, gamma: number, policyK: number): void {
  for (let i = 0; i < policyK; ++i) {
    const uTemp: Record<string, number> = {};
    for (const n in G.nodes) {
      if (!G.getNode(n).isTerminal) {
        uTemp[n] = calculateUtility(G, n, choice(pi[n]), gamma);
      }
    }
    G.setNodeUtilities(uTemp);
  }
}

function inPlacePolicyEvaluation(G: Graph, _: any, gamma: number, policyK: number): void {
  for (let i = 0; i < policyK; ++i) {
    for (const n in G.nodes) {
      G.getNode(n).utility = calculateMaxUtility(G, n, gamma);
    }
  }
}

function policyEvaluation(G: Graph, _: any, gamma: number, policyK: number): void {
  for (let i = 0; i < policyK; ++i) {
    const uTemp: { [key: string]: number } = {};
    for (const n in G.nodes) {
      uTemp[n] = calculateMaxUtility(G, n, gamma);
    }

    G.setNodeUtilities(uTemp);
  }
}

function policyImprovement(G: Graph, pi: Policy, gamma: number): boolean {
  let changed = false;
  for (const n in G.nodes) {
    if (G.getNode(n).isTerminal) {
      continue;
    }

    let bestS: string | null = null;
    let bestU = -Infinity;

    for (const np of G.neighbors(n)) {
      const up = calculateUtility(G, n, np, gamma);
      
      if (up === bestU) {
        bestS
      } else if (up > bestU) {
        bestS = np;
        bestU = up;
      }
    }

    if (choice(pi[n]) !== bestS) {
      pi[n].length = 0;
      pi[n].push(bestS!);
      changed = true;
    }
  }

  return changed;
}

export function policyIteration(
  G: Graph,
  gamma: number,
  modified: boolean = false,
  inPlace: boolean = false,
  policyK: number = 10,
  shouldResetUtility: boolean = true
): Policy {
  if (shouldResetUtility) {
    resetUtility(G);
  }

  const pi: Policy = createRandomPolicy(G);
  let policyEval: (G: Graph, pi: Policy, gamma: number, policyK: number) => void;

  if (modified && inPlace) {
    policyEval = modifiedInPlacePolicyEvaluation;
  } else if (modified && !inPlace) {
    policyEval = modifiedPolicyEvaluation;
  } else if (!modified && inPlace) {
    policyEval = inPlacePolicyEvaluation;
  } else {
    policyEval = policyEvaluation;
  }

  let loop: boolean = true;
  while (loop) {
    policyEval(G, pi, gamma, policyK);
    loop = policyImprovement(G, pi, gamma);
  }

  policyEval(G, pi, gamma, policyK);
  policyImprovement(G, pi, gamma);

  // You would usually return the already made policy, but I need to remake it
  // because I'm returning an array of neighbor states with equivalent utility.
  return createPolicy(G, gamma); 
}

