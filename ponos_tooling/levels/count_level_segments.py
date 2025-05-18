
import json
import os

with open("graph.json", "r") as f:
    graph = json.load(f)

nodes = 0
levels = 0
for src in graph['graph']:
    if src == "start":
        continue

    nodes += 1

    with open(os.path.join("segments", f"{src}.txt")) as f:
        for line in f:
            l = line.strip()
            if l == "&":
                levels += 1

        levels += 1

print(f"nodes:  {nodes}")
print(f"levels: {levels}")