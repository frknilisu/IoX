#!/bin/bash

kill $(ps aux | grep 'geth' | awk '{print $2}' | head -1)
BASE=~/IoX
rm -rf $BASE/keystore/ $BASE/nohup.out $BASE/geth.log $BASE/history
geth --datadir=$BASE init genesis.json		# init with genesis
nohup geth --identity=$1 --networkid=42 --datadir=$BASE --nodiscover --ws --rpc --rpcapi db,eth,net,web3,personal,web3,admin >> geth.log &