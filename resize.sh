#!/bin/bash
set -e

## Usage ./resize.sh image.png 20x20

if ! command -v convert &>/dev/null; then
  echo 'Install imagemagick: sudo apt-get install imagemagick -y'
  exit 1
fi

if [ $# -ne 2 ]
  then
    echo "No arguments supplied"
    exit
fi

filename=$(echo "$1" | cut -f 1 -d '.')
extension="${1##*.}"

set -x
convert "$1" -resize "$2"\> "$filename-$2.$extension"
