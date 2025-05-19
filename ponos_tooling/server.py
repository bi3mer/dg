from levels.dungeongrams.dungeongrams import completion, FLAW_NO_FLAW, solve_and_run
from computational_metrics import computational_metrics, proximity_to_enemies, jaccard_similarity
from computational_metrics import percent_difference, density
from grid_tools import columns_into_rows

from typing import List, Dict, Any
from json import loads, dumps, load
import traceback
import socket
import os
import sys


###############################################################################
# Function for getting all the levels used for the n-grams in Ponos
def get_levels():
    lvls = []

    # levels made for previous work
    path = os.path.join("ponos_tooling", "levels", "dungeongrams", "train")
    for file_name in os.listdir(path):
        with open(os.path.join(path, file_name), 'r') as f:
            lvls.append(f.readlines())

    path = os.path.join("ponos_tooling", "levels", "dungeongrams", "other_training_levels")
    for file_name in os.listdir(path):
        with open(os.path.join(path, file_name), 'r') as f:
            lvls.append(f.readlines())

    # levels from handcrafted progression
    path = os.path.join("ponos_tooling", "levels", "segments")
    for file_name in os.listdir(path):
        with open(os.path.join(path, file_name), 'r') as f:
            lvl = []
            for line in f:
                l = line.strip()
                if l == "&":
                    lvls.append(lvl)
                    lvl = []
                else:
                    lvl.append(l)

            lvls.append(lvl)

    return lvls

###############################################################################
# Get models for reward function
with open(os.path.join("ponos_tooling", "diff.json"), 'rb') as f:
    data = load(f)
    diff_coef = data["coef"]
    diff_int = data["int"]

with open(os.path.join("ponos_tooling", "enj.json"), 'rb') as f:
    data = load(f)
    enj_coef = data["coef"]
    enj_int = data["int"]

del data

# linear regression prediction
def predict(coef, intercept, data) -> float:
    return sum(c * x for c, x in zip(coef, data)) + intercept

# Find the correct reward value for the given level by using the models
def get_reward(lvl: List[str]) -> float:
    solution_with_enemies = solve_and_run(lvl, False, True, True, FLAW_NO_FLAW, False, False)
    assert(solution_with_enemies[0])
    path_with_enemies = solution_with_enemies[4]
    stamina_with_enemies = solution_with_enemies[5]

    level_no_enemies = [r.replace('#', '-').replace('^', '-') for r in lvl]
    level_no_nothing = [r.replace('*', '-') for r in level_no_enemies]

    solution_no_nothing = solve_and_run(level_no_nothing, False, True, True, FLAW_NO_FLAW, False, False)
    assert(solution_no_nothing[0])
    path_no_nothing = solution_no_nothing[4]

    solution_no_enemies = solve_and_run(level_no_enemies, False, True, True, FLAW_NO_FLAW, False, False)
    assert(solution_no_enemies[0])
    # path_no_enemies = solution_no_enemies[4]
    stamina_no_enemies = solution_no_enemies[5]

    prox_to_enemies = proximity_to_enemies(lvl, path_with_enemies)
    jaccard_nothing = jaccard_similarity(path_with_enemies, path_no_nothing)

    enjoyment = predict(enj_coef, enj_int, [prox_to_enemies])
    difficulty = predict(diff_coef, diff_int, [
        jaccard_nothing,
        prox_to_enemies,
        percent_difference(stamina_with_enemies, stamina_no_enemies),
        density(lvl)
    ])

    return (enjoyment + difficulty) / 2.0

###############################################################################
# Handle the "assess" request type
def assess(lvl: List[str]) -> Dict[str, Any]:
    didwin, level, best_switches, best_cols, path, stamina_left = \
        solve_and_run(lvl, False, True, False, FLAW_NO_FLAW, False, False)

    percent_complete = 1.0 if didwin else completion(level, best_switches, best_cols)
    print(f"Percent playable: {percent_complete}\n")

    density, enemies  = computational_metrics(lvl)
    print(round(len(path)/ 10))
    return {
        "completability": percent_complete,
        "density": density,
        "enemies": enemies,
        "path length": round(len(path) / 10),
        "stamina left": round((40 - stamina_left) / 2)
    }

###############################################################################
# This function starts a socket server that works with Ponos
def server(host='localhost', port=8080):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind((host, port))
            s.listen(1)
            print(f"Server listening on {host}:{port}")

            while True:
                conn, addr = s.accept()
                print(f"Connected by {addr}")

                with conn:
                    while True:
                        cmd = conn.recv(1024)
                        if not cmd:
                            break

                        if cmd == b"config":
                            with open(os.path.join("ponos_tooling", "config.json"), "r") as f:
                                conn.sendall(bytes(f.read(), "utf-8"))
                        elif cmd == b'levels':
                            conn.sendall((dumps(get_levels())+'EOF').encode())
                        elif cmd[:6] == b'assess':
                            lvl = columns_into_rows(loads(cmd[6:].decode('utf-8')))
                            print("\n".join(lvl))

                            conn.sendall(dumps(assess(lvl)).encode('utf-8'))
                        elif cmd[:6] == b'reward':
                            lvl = columns_into_rows(loads(cmd[6:].decode('utf-8')))

                            return_data = {
                                'reward': get_reward(lvl) / 7.0
                            }

                            conn.sendall(dumps(return_data).encode('utf-8'))
                        else:
                            print(f'Unrecognized command: {cmd}')
                            error_message = bytes(f'Unrecognized command: {cmd}', 'utf-8')
                            conn.sendall(error_message)
        except Exception as e:
            print(f"An error occurred: {e}")
            traceback.print_exc(file=sys.stdout)
            s.close()

if __name__ == "__main__":
    server()