import { policyIteration } from "../src/ADP/policyIteration";
import { valueIteration } from "../src/ADP/valueIteration";
import { greedyPolicy } from "../src/Baseline/greedy";
import { randomPolicy } from "../src/Baseline/random";
import { Graph } from "../src/Graph/graph";
import type { Policy } from "../src/policy";
import { runPolicy } from "../src/util";


// |-----|-----|-----|-----|
// |-0.04|-0.04|-0.04| 1.0 |
// |-0.04|XXXXX|-0.04|-1.0 |
// |-0.04|-0.04|-0.04|-0.04|
// |-----|-----|-----|-----|

const R = -0.0001;
const G = new Graph();

// ---------- Nodes ---------- 
// bot row
G.addDefaultNode('0,0', R, 0, false);
G.addDefaultNode('1,0', R, 0, false);
G.addDefaultNode('2,0', R, 0, false);
G.addDefaultNode('3,0', R, 0, false);

// mid row
G.addDefaultNode('0,1', R, 0, false);
G.addDefaultNode('2,1', R, 0, false);
G.addDefaultNode('3,1', -1, 0, true);

// Top row
G.addDefaultNode('0,2', R, 0, false);
G.addDefaultNode('1,2', R, 0, false);
G.addDefaultNode('2,2', R, 0, false);
G.addDefaultNode('3,2', 1, 0, true);

// ---------- Edges ---------- 
// bot row
G.addDefaultEdge('0,0', '1,0', [['1,0', 0.8], ['0,1', 0.2]]);
G.addDefaultEdge('0,0', '0,1', [['0,1', 0.8], ['1,0', 0.2]]);

G.addDefaultEdge('1,0', '0,0', [['0,0', 0.8], ['2,0', 0.1]]);
G.addDefaultEdge('1,0', '2,0', [['2,0', 0.8], ['0,0', 0.1]]);

G.addDefaultEdge('2,0', '1,0', [['1,0', 0.8], ['2,1', 0.2], ['3,0', 0.1]]);
G.addDefaultEdge('2,0', '3,0', [['3,0', 0.8], ['2,1', 0.1], ['1,0', 0.1]]);
G.addDefaultEdge('2,0', '2,1', [['2,1', 0.8], ['1,0', 0.1], ['3,0', 0.1]]);

G.addDefaultEdge('3,0', '2,0', [['2,0', 0.8], ['3,1', 0.2]]);
G.addDefaultEdge('3,0', '3,1', [['3,1', 0.8], ['2,0', 0.2]]);

// mid row
G.addDefaultEdge('0,1', '0,0', [['0,0', 0.8], ['1,0', 0.2]]);
G.addDefaultEdge('0,1', '0,2', [['0,2', 0.8], ['0,0', 0.2]]);

G.addDefaultEdge('2,1', '2,2', [['2,2', 0.8], ['3,1', 0.1], ['2,0', 0.1]]);
G.addDefaultEdge('2,1', '3,1', [['3,1', 0.8], ['2,2', 0.1], ['2,0', 0.1]]);
G.addDefaultEdge('2,1', '2,0', [['2,0', 0.8], ['2,2', 0.1], ['3,1', 0.1]]);

// top row
G.addDefaultEdge('0,2', '0,1', [['0,1', 0.8], ['1,2', 0.2]]);
G.addDefaultEdge('0,2', '1,2', [['1,2', 0.8], ['0,1', 0.2]]);

G.addDefaultEdge('1,2', '0,2', [['0,2', 0.8], ['2,2', 0.2]]);
G.addDefaultEdge('1,2', '2,2', [['2,2', 0.8], ['0,2', 0.2]]);

G.addDefaultEdge('2,2', '1,2', [['1,2', 0.8], ['3,2', 0.1], ['2,1', 0.1]]);
G.addDefaultEdge('2,2', '3,2', [['3,2', 0.8], ['1,2', 0.1], ['2,1', 0.1]]);
G.addDefaultEdge('2,2', '2,1', [['2,1', 0.8], ['1,2', 0.1], ['3,2', 0.1]]);

// ---------- Example of Policies ---------- 
function displayUtilities(G: Graph) {
  for (let y = 2; y >= 0; --y) {
    let str = "";
    for (let x = 0; x < 4; ++x) {
      const key = `${x},${y}`;

      if (key in G.nodes) {
        str += `${G.nodes[key].utility.toFixed(3)} `;
      } else {
        str += "       ";
      }
    }

    console.log(str);
  }
}
function printPolicyResults(policy: Policy, name: string, displayUTable: boolean) {
  const [steps, rewards] = runPolicy(G, '0,0', policy, 10);
  console.log(`${name}: ${rewards.reduce((a, b) => a + b)}`);

  if (displayUTable) {
    displayUtilities(G);
  }

  console.log('\n\n');
}

printPolicyResults(greedyPolicy(G), 'Greedy', false);
printPolicyResults(randomPolicy(G), 'Random', false);
printPolicyResults(policyIteration(G, 1.0), 'Policy Iteration', true);
printPolicyResults(valueIteration(G, 100, 1.0, 0.0000000001), 'Valute Iteration', true);
