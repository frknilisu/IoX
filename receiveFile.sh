#!/bin/bash

HOST=192.168.2.165
USER=pi
PASS=raspberry
BASE=~/Desktop/IoX/

echo “Receiving $1 ...”
scp $USER@$HOST:/home/pi/IoX/$1 $BASE
echo “Received”