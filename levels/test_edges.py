import json
import os

from dungeongrams.dungeongrams import FLAW_NO_FLAW, percent_playable

with open("graph.json", "r") as f:
    graph = json.load(f)


id_to_lvls = {}
for src in graph['graph']:
    if src == "start":
        continue

    with open(os.path.join("segments", f"{src}.txt")) as f:
        levels = []
        lvl = []
        for line in f:
            l = line.strip()
            if l == "&":
                levels.append(lvl)
                lvl = []
            else:
                lvl.append(l)

        levels.append(lvl)
        id_to_lvls[src] = levels

invalids = []
for src_name, src_lvls in id_to_lvls.items():
    for tgt_name in graph['graph'][src_name]["neighbors"]:
        for i_src, src_lvl in enumerate(src_lvls):
            for i_tgt, tgt_lvl in enumerate(id_to_lvls[tgt_name]):
                combined_level = [src_lvl[i] + tgt_lvl[i] for i in range(len(src_lvl))]

                print('\n'.join(combined_level))
                playable = percent_playable(combined_level, False, True, True, FLAW_NO_FLAW)
                print(f"Completable: {playable}")
                print()

                if playable != 1.0:
                    invalids.append(f"{src_name}-{i_src} -> ${tgt_name}-{i_tgt} not playable.")

if len(invalids) == 0:
    print("Every edge was playable!")
else:
    for text in invalids:
        print(text)