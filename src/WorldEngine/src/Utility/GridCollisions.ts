import { Position2d } from "../Components/Position2d";
import { Entity } from "../Entity";

export class GridCollisions {
  private grid = new Map<number, Entity>();

  public get(pos: Position2d): Entity | undefined {
    return this.grid.get(pos.hash());
  }

  public set(pos: Position2d, val: Entity): boolean {
    const hash = pos.hash();
    if(this.grid.has(hash)) {
      return false;
    }

    this.grid.set(hash, val);
    return true;
  }

  public remove(pos: Position2d, useNew: boolean): void {
    if(useNew) {
      this.grid.delete(pos.hash());
    } else {
      this.grid.delete(pos.oldHash());
    }
  }

  public acceptChange(pos: Position2d, val: Entity) {
    this.grid.delete(pos.oldHash());
    pos.acceptChange();
    this.grid.set(pos.hash(), val)
  }
};