
import { Graph } from '../Graph/graph';
import { createRandomPolicy } from '../util';
import type { Policy } from '../policy';

export function randomPolicy(G: Graph): Policy {
  return createRandomPolicy(G);
}

