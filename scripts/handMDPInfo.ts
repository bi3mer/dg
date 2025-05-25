import { HAND_MDP } from "../src/handcraftedMDP";
import { AUTO_MDP } from "../src/autoMDP";
import { Graph } from "../src/GDM-TS";

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

console.log(`Number of nodes: ${Object.keys(HAND_MDP.nodes).length}`);
console.log(`Number of edges: ${Object.keys(HAND_MDP.edges).length}`);
console.log("Path from start to min:", bfs(HAND_MDP, "start", "end-0").length);

console.log(`Number of nodes: ${Object.keys(AUTO_MDP.nodes).length}`);
console.log(`Number of edges: ${Object.keys(AUTO_MDP.edges).length}`);
console.log("Path from start to min:", bfs(AUTO_MDP, "start", "end").length);
