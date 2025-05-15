import { Edge } from "./GDM-TS/src/Graph/edge";

export class CustomEdge extends Edge {
  constructor(
    src: string,
    tgt: string,
    probability: Array<[string, number]>,
    public link: string[],
  ) {
    super(src, tgt, probability);
  }
}
