#!/bin/bash

bun run prod

if [ -d "static" ]; then
    rm -r static
fi

mkdir static
mkdir static/dist
# mkdir static/audio

cp dist/index.js static/dist/
cp index.html static/
cp game.html static/
cp consent_form.pdf static/

zip -r static.zip static
scp static.zip colanbiemer@erdrick.khoury.northeastern.edu:~/.

rm -r static
rm static.zip

ssh -t colanbiemer@erdrick.khoury.northeastern.edu "./upload.sh"
