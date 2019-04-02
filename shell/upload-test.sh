#!/usr/bin/env bash
(
    echo "---------- uploading ----------";
    cd output;
    scp -r ultron xiaoju@10.179.37.215:/home/xiaoju/app/ultron;

    echo "---------- done ----------";
)

#p@ssw0rd
