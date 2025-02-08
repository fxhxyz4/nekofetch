#!/bin/sh

# nvm use
npm i

rm -rf ./build/
mkdir ./build/

npm run build
