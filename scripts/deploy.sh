#!/bin/sh
# Publishes only the web files to the gh-pages branch of origin.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE="$(git -C "$ROOT" remote get-url origin)"
DEPLOY="$ROOT/.deploy"

rm -rf "$DEPLOY"
mkdir "$DEPLOY"
cp -R "$ROOT/index.html" "$ROOT/manifest.webmanifest" "$ROOT/.nojekyll" \
      "$ROOT/css" "$ROOT/js" "$ROOT/lib" "$ROOT/assets" "$DEPLOY/"

cd "$DEPLOY"
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy $(git -C "$ROOT" rev-parse --short HEAD)"
git -c credential.helper= -c "credential.helper=!gh auth git-credential" push -f -q "$REMOTE" gh-pages
rm -rf "$DEPLOY"
echo "Published to $REMOTE (gh-pages)"
