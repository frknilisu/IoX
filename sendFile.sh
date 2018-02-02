#!/bin/bash

HOST=192.168.2.165
USER=pi
BASE=~/Desktop/IoX/

echo “Sending $1 ...”
scp $BASE/$1 $USER@$HOST:/home/pi/IoX
echo “Sended”