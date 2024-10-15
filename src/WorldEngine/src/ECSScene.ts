import { Engine } from "./Engine";
import { Scene } from "./Scene";

import { Component, ComponentContainer } from "./Component";
import { Entity } from "./Entity";
import { System } from "./System";

// https://maxwellforbes.com/posts/typescript-ecs-implementation/ is what this
// implementation is based off of.
export abstract class ECSScene extends Scene {

  // Main state
  private entities = new Map<Entity, ComponentContainer>()
  private priorityToSystem = new Map<number, System>()
  private priorityToComponents = new Map<number, Set<Entity>>();
  private priorities = new Array<number>();
  private blackBoard: Map<string, any> = new Map<string, any>();

  // Bookkeeping for entities.
  private nextEntityID = 0
  private entitiesToDestroy = new Array<Entity>()

  public abstract customUpdate(engine: Engine): number;

  /**
   * Default return -1. Any other numbers will tell the game engine to change 
   * the scene to whatever index is returned.
   * @param canvas 
   * @param keyPresses 
   */
  public update(engine: Engine): number {
    // Update all systems. (Later, we'll add a way to specify the
    // update order.)
    for (let priority of this.priorities) {
      const system = this.priorityToSystem.get(priority)!;
      const components = this.priorityToComponents.get(priority)!;
      system.update(engine, components);
    }

    // Remove any entities that were marked for deletion during the
    // update.
    while (this.entitiesToDestroy.length > 0) {
      this.destroyEntity(this.entitiesToDestroy.pop()!);
    }

    return this.customUpdate(engine);
  }
  

  // API: Entities

  public addEntity(): Entity {
    let entity = this.nextEntityID;
    this.nextEntityID++;
    this.entities.set(entity, new ComponentContainer());
    return entity;
  }

  /**
   * Marks `entity` for removal. The actual removal happens at the end
   * of the next `update()`. This way we avoid subtle bugs where an
   * Entity is removed mid-`update()`, with some Systems seeing it and
   * others not.
   */
  public removeEntity(entity: Entity): void {
    this.entitiesToDestroy.push(entity);
  }

  public addComponent(entity: Entity, component: Component): void {
    this.entities.get(entity)!.add(component);
    this.checkE(entity);
  }

  public getComponents(entity: Entity): ComponentContainer  {
    return this.entities.get(entity)!;
  }

  public removeComponent(entity: Entity, componentClass: Function): void {
    this.entities.get(entity)?.delete(componentClass);
    this.checkE(entity);
  }

  public setBB(key: string, val: any): void {
    this.blackBoard.set(key, val);
  }

  public getBB(key: string): any {
    return this.blackBoard.get(key);
  }

  // API: Systems
  /**
   * Add a system where the priority defines in what order it will be run when
   * compared to other systems
   * @param priority - lower value is run first
   * @param system 
   */
  public addSystem(priority: number, system: System): void {
    if(this.priorities.includes(priority)) {
      alert('Fatal error. Check the console.');
      console.error(`${system} can not be used since priority ${priority} already in use.`);
      return;
    }

    // Give system a reference to the ECS so it can actually do
    // anything.
    system.ecs = this;
    
    this.priorityToSystem.set(priority, system);
    this.priorityToComponents.set(priority, new Set());
    this.priorities.push(priority);
    this.priorities.sort();

    // Save system and set who it should track immediately.
    for (let entity of this.entities.keys()) {
      this.checkES(entity, priority);
    }
  }

  protected clear(): void {
    this.entities.clear();
    this.priorityToComponents.clear();
    this.priorityToSystem.clear();
    this.blackBoard.clear();
    this.priorities.length = 0;
    this.nextEntityID = 0;
  }

  private destroyEntity(entity: Entity): void {
    this.entities.delete(entity);
    for(let priority of this.priorities) {
      this.priorityToComponents.get(priority)?.delete(entity);
    }
  }

  // @TODO: can I remove this?
  private checkE(entity: Entity): void {
    for(let priority of this.priorities) {
      this.checkES(entity, priority);
    }
  }

  /**
   * I think this can be removed but I'm going to leave it in for now.
   * @param entity 
   * @param system 
   */
  private checkES(entity: Entity, priority: number): void {
    let have = this.entities.get(entity);
    let need = this.priorityToSystem.get(priority)!.componentsRequired;

    if (have!.hasAll(need)) {
      // should be in system
      this.priorityToComponents.get(priority)!.add(entity);
    } else {
      // should not be in system
      this.priorityToComponents.get(priority)!.delete(entity);
    }
  }
};