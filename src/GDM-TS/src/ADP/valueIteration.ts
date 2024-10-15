
import { Graph } from "../Graph/graph";
import type { Policy } from "../policy";
import { resetUtility, createPolicy, calculateMaxUtility } from "../util";

function __inPlaceValueIteration(G: Graph, max_iteration: number, gamma: number, theta: number): void {
  for (let k = 0; k < max_iteration; k++) {
    let delta = 0;
    for (const n in G.nodes) {
      const node = G.getNode(n);
      const u = calculateMaxUtility(G, n, gamma);
      delta = Math.max(delta, Math.abs(node.utility - u));
      node.utility = u;
    }
    console.log(`delta=${delta}`);
    if (delta < theta) {
      break;
    }
  }
  console.log(`${max_iteration} iterations to converge.`);
}

function __valueIteration(G: Graph, max_iteration: number, gamma: number, theta: number): void {
  for (let _ = 0; _ < max_iteration; _++) {
    let delta = 0;
    const u_temp: { [key: string]: number } = {};
    for (const n in G.nodes) {
      const u = calculateMaxUtility(G, n, gamma);
      delta = Math.max(delta, Math.abs(G.utility(n) - u));
      u_temp[n] = u;
    }
    G.setNodeUtilities(u_temp);
    if (delta < theta) {
      break;
    }
  }
}

export function valueIteration(
  G: Graph,
  max_iteration: number,
  gamma: number,
  theta: number,
  inPlace: boolean = false,
  shouldResetUtility: boolean = true
): Policy {
  if (shouldResetUtility) {
    resetUtility(G);
  }
  if (inPlace) {
    __inPlaceValueIteration(G, max_iteration, gamma, theta);
  } else {
    __valueIteration(G, max_iteration, gamma, theta);
  }

  return createPolicy(G, gamma);
}

