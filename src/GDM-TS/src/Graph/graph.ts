import { Edge } from "./edge";
import { Node } from "./node";

export class Graph {
  nodes: { [key: string]: Node };
  edges: { [key: string]: Edge };

  constructor() {
    this.nodes = {};
    this.edges = {};
  }

  getNode(nodeName: string): Node {
    return this.nodes[nodeName];
  }

  hasNode(nodeName: string): boolean {
    return nodeName in this.nodes;
  }

  addNode(node: Node) {
    this.nodes[node.name] = node;
  }

  addDefaultNode(
    nodeName: string,
    reward: number = 1.0,
    utility: number = 0.0,
    terminal: boolean = false,
    neighbors: string[] | null = null
  ) {
    if (neighbors == null) {
      neighbors = [];
    }
    this.nodes[nodeName] = new Node(nodeName, reward, utility, terminal, neighbors);
  }

  removeNode(nodeName: string) {
    const edgesToRemove: Edge[] = [];
    for (const e of Object.values(this.edges)) {
      if (e.src == nodeName || e.tgt == nodeName) {
        edgesToRemove.push(e);
      }

      const probabilities = e.probability;
      let index = -1;
      for (let i = 0; i < probabilities.length; i++) {
        const [name, _] = probabilities[i];
        if (name == nodeName) {
          index = i;
          break;
        }
      }
      if (index == -1) {
        continue;
      }

      const pValue = probabilities[index][1];
      probabilities.splice(index, 1);
      const len = probabilities.length;
      const pValueNew = pValue / len;
      e.probability = probabilities.map(([name, p]) => [name, p + pValueNew]);
    }
    for (const e of edgesToRemove) {
      this.removeEdge(e.src, e.tgt);
    }
    delete this.nodes[nodeName];
  }

  getEdge(srcName: string, tgtName: string): Edge {
    return this.edges[`${srcName},${tgtName}`];
  }

  hasEdge(srcName: string, tgtName: string): boolean {
    return `${srcName},${tgtName}` in this.edges;
  }

  addEdge(edge: Edge) {
    this.edges[`${edge.src},${edge.tgt}`] = edge;
    const neighbors = this.nodes[edge.src].neighbors;
    if (!neighbors.includes(edge.tgt)) {
      neighbors.push(edge.tgt);
    }
  }

  addDefaultEdge(srcName: string, tgtName: string, p: [string, number][] | null = null) {
    if (p == null) {
      p = [[tgtName, 1.0]];
    }
    this.addEdge(new Edge(srcName, tgtName, p));
  }

  removeEdge(srcNode: string, tgtNode: string) {
    const src = this.nodes[srcNode];
    const index = src.neighbors.indexOf(tgtNode);
    src.neighbors.splice(index, 1);
    delete this.edges[`${srcNode},${tgtNode}`];
  }

  neighbors(nodeName: string): string[] {
    return this.nodes[nodeName].neighbors;
  }

  setNodeUtilities(utilities: { [key: string]: number }) {
    for (const [nodeName, utility] of Object.entries(utilities)) {
      this.nodes[nodeName].utility = utility;
    }
  }

  utility(nodeName: string): number {
    return this.nodes[nodeName].utility;
  }

  reward(nodeName: string): number {
    return this.nodes[nodeName].reward;
  }

  isTerminal(nodeName: string): boolean {
    return this.nodes[nodeName].isTerminal;
  }

  mapNodes(lambda: (node: Node) => void) {
    for (const n of Object.values(this.nodes)) {
      lambda(n);
    }
  }

  mapEdges(lambda: (edge: Edge) => void) {
    for (const e of Object.values(this.edges)) {
      lambda(e);
    }
  }
}


