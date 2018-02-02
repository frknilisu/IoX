#!/bin/bash

BASE=~/IoX
nohup geth --identity=$1 --networkid=42 --datadir=$BASE --nodiscover --ws --rpc --rpcapi db,eth,net,web3,admin,personal,web3 >> geth.log &
