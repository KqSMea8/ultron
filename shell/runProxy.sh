#!/usr/bin/env bash
kill -9 `lsof -t -i:7210` #强制删除占用端口的进程
node shell/runProxy.js
