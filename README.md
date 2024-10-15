# DG

TODO: Description of the game with a screenshot.

## Development Notes

The game is written in [TypeScript](https://www.typescriptlang.org/), which is currently not supported by browsers. The game is also written across multiple files. I use [bun](https://bun.sh/) to turn the TypeScript into JavaScript and run webpack to make all the files one bundle, but I think you could plug in [node](https://nodejs.org/en) or [deno](https://deno.com/) with little to no hassle.

Rather than type `bun run build` whenever you want to test, just run:

```bash
bun run watch
```

Then you can refresh the webpage. Speaking of, you can't just run `open index.html` to test the game. This doesn't work because the website uses cookies to store basic info like if the player has played the tutorial. Therefore, you need to run a local server. I use `python3 -m http.server` and then it will print out the port. So usually you can put `127.0.0.1:8000` into your browser and test the game. 

When done, you can build a production version:

```bash
bun run prod
```

## Other implementations

TODO: fill me in.