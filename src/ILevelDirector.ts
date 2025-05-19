export interface ILevelDirector {
  update(playerWon: boolean, playerColumn: number): void;
  get(levelSegments: number): string[];
  playerOnLastLevel(): boolean;
}
