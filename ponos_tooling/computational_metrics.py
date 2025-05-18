from typing import List, Tuple

###############################################################################
# One way to go about computational metrics is like below where you loop
# through the level for each metric
def density(lvl):
    dense_chars =  sum(sum(c == "X" or c == "^" for c in row) for row in lvl)
    area = len(lvl) * len(lvl[0])

    return dense_chars / area

def enemies(lvl):
    dense_chars =  sum(sum(c == "#" for c in row) for row in lvl)
    area = len(lvl) * len(lvl[0])

    return dense_chars / area

def switches(lvl):
    dense_chars =  sum(sum(c == "*" for c in row) for row in lvl)
    area = len(lvl) * len(lvl[0])

    return dense_chars / area

def spikes(lvl):
    dense_chars =  sum(sum(c == "^" for c in row) for row in lvl)
    area = len(lvl) * len(lvl[0])

    return dense_chars / area


###############################################################################
# A slightly better way, though, is to loop through once
def computational_metrics(lvl: List[List[str]]) -> Tuple[float, float, float, float]:
    density = 0
    enemies = 0
    switches = 0
    food = 0

    for row in lvl:
        for c in row:
            if c == "X" or c == "/" or c == "\\" or c == "^":
                density += 1
            elif c == "*":
                switches += 1
            elif c == "#":
                enemies += 1
            elif c == "&":
                food += 1

    area = len(lvl) * len(lvl[0])
    return density / area, enemies, switches, food