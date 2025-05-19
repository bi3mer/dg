import { AUTO_MDP } from "../src/autoMDP";
import { NUM_ROWS } from "../src/constants";
import { CustomEdge } from "../src/customEdge";
import { CustomNode } from "../src/customNode";

const keys = ["6_0_2_0-0", "6_0_4_0-0"];

let r: number;
const lvl: string[] = Array(NUM_ROWS).fill("");
const length = keys.length;

for (let i = 0; i < length; ++i) {
  console.log(i, keys[i]);
  const stateLVL = (AUTO_MDP.getNode(keys[i]) as CustomNode).level.slice(); // copy by value

  // add link if necessary. Note, we add it to state level so columnsPerLevel
  // is correct
  if (i > 0) {
    const edge = AUTO_MDP.getEdge(keys[i - 1], keys[i]);
    if (edge instanceof CustomEdge) {
      const link = edge.link;
      console.log(link);
      const linkLength = link.length;
      if (linkLength > 0) {
        for (let jj = 0; jj < linkLength; ++jj) {
          const column = link[jj];
          for (r = 0; r < NUM_ROWS; ++r) {
            stateLVL[r] = column[r] + stateLVL[r];
          }
        }
      }
    }
  }

  for (r = 0; r < NUM_ROWS; ++r) {
    lvl[r] += stateLVL[r];
  }
}

// This is nice for debugging, but not strictly necessary in the final product
console.log(lvl.join("\n"));
