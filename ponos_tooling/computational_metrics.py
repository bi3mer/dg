from typing import List, Tuple

def computational_metrics(lvl: List[str]) -> Tuple[float, float]:
    density = 0
    enemies = 0
    # switches = 0

    for row in lvl:
        for c in row:
            if c == "X" or c == "/" or c == "\\" or c == "^":
                density += 1
            # elif c == "*":
            #     switches += 1
            elif c == "#":
                enemies += 1

    area = len(lvl) * len(lvl[0])
    return density / area, enemies

ENEMY_RANGE = 3
ENEMY_RADIUS =[
    (x,y) for x in range(-ENEMY_RANGE, ENEMY_RANGE)
            for y in range(-ENEMY_RANGE, ENEMY_RANGE)
            if x != 0 and y != 0
]


def manhattan_distance(x1: int, y1: int, x2: int, y2: int) -> int:
    return abs(x2-x1) + abs(y2-y1)

def proximity_to_enemies(level: List[str], path: List[Tuple[int, int]]) -> float:
    in_proximity = 0
    for (y, x) in path:
        for (x_mod, y_mod) in ENEMY_RADIUS:
            _x = x + x_mod
            _y = y + y_mod

            if _x < 0 or _y < 0 or _x >= len(level[0]) or _y >= len(level):
                continue

            if level[_y][_x] == '#':
                in_proximity += 1/manhattan_distance(x, y, _x, _y)

    return in_proximity / len(path)


# https://dataaspirant.com/five-most-popular-similarity-measures-implementation-in-python
def jaccard_similarity(a: List[Tuple[int, int]], b: List[Tuple[int, int]]) -> float:
    _a = set(a)
    _b = set(b)

    intersection_cardinality = len(set.intersection(*[_a, _b]))
    union_cardinality = len(set.union(*[_a, _b]))

    return 1.0 - intersection_cardinality/union_cardinality

def percent_difference(a: float, b: float) -> float:
    return abs(a-b) / ((a+b)/2)

SOLIDS = ['X', '^', '/', '\\']
def density(level: List[str]) -> float:
    num_tiles = len(level) * len(level[0])
    return sum(sum(1 for t in r if t in SOLIDS) for r in level) / num_tiles
