import { Engine } from "./Engine";

export abstract class Scene {
  /**
   * Default return -1. Any other numbers will tell the game engine to change 
   * the scene to whatever index is returned.
   * @param canvas 
   * @param keyPresses 
   */
  public abstract update(engine: Engine): number;
  
  public abstract onEnter(engine: Engine): void;
  public abstract onExit(engine: Engine): void;
};