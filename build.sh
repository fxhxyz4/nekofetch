#!/bin/sh

set -e

echo ""
echo ""

X_NODE=$(grep -Eo '^[0-9]+\.[0-9]+\.[0-9]+' .nvmrc)

if [ -z "$X_NODE" ]; then
    X_NODE="18.19.1"
fi

if [ -n "$BASH_VERSION" ] || [ -n "$ZSH_VERSION" ]; then
    # for bash or zsh
    export X_NODE="$X_NODE"
elif [ -n "$FISH_VERSION" ]; then
    # for fish
    set -x X_NODE $X_NODE
fi

echo "🔧 Building the project..."
echo ""
echo ""

echo "📜 NodeJS version: $X_NODE"
# nvm use $X_NODE

echo ""
echo ""

echo ""
echo ""

echo "🚀  Installing npm dependencies..."
npm i

echo ""
echo ""

echo ""
echo ""

echo ""
echo "❌ Clear build folder"

rm -rf ./build/
mkdir ./build/

echo ""
echo ""

echo "🚀 Run build for (linux, mac, win)"
npm run build

echo ""
echo ""

echo ""
echo "✅ Done!"

echo ""
echo ""
