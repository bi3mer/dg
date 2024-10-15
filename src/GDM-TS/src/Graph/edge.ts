export class Edge {
  src: string;
  tgt: string;
  probability: Array<[string, number]>;

  constructor(src: string, tgt: string, probability: Array<[string, number]>) {
    this.src = src;
    this.tgt = tgt;
    this.probability = probability;
  }
}
