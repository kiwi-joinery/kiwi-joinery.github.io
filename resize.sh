#!/bin/bash
set -e

## Usage ./resize.sh image.png

if ! command -v convert &>/dev/null; then
  echo 'Install imagemagick: sudo apt-get install imagemagick -y'
  exit 1
fi

if [ $# -ne 1 ]
  then
    echo "Requires file path argument"
    exit
fi

IMG_WIDTHS=(100 300 500 750 1000 1500 2500)
FILE_WIDTH=$(identify -format "%w" $1)
FILE_HEIGHT=$(identify -format "%h" $1)
FILE_PATH=$(dirname "${1}")
FILE_EXT="${1##*.}"
OUTPUT=

for WIDTH in "${IMG_WIDTHS[@]}"
do
  if [ $WIDTH -lt $FILE_WIDTH ]
    then
      NEW_FILE="${FILE_PATH}/${WIDTH}w.${FILE_EXT}"
      convert "$1" -resize "${WIDTH}x${FILE_HEIGHT}" ${NEW_FILE}
      OUTPUT+="${NEW_FILE} ${WIDTH}w, \n"
  fi
done

OUTPUT+="${1} ${FILE_WIDTH}w"

echo -e $OUTPUT
