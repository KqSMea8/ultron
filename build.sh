#!/usr/bin/env bash
export NODE_PATH=/home/xiaoju/node-v7.8.0-linux-x64:/home/xiaoju/node-v7.8.0-linux-x64/lib/node_modules
export PATH=/home/xiaoju/node-v7.8.0-linux-x64/bin:$PATH
npm install --registry=http://registry.npm.xiaojukeji.com --color=false

sh shell/build.sh
