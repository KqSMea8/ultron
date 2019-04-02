#!/usr/bin/env bash

STEP_BEGIN_DATE=`date +%F`" [Project 日期] 开始构建任务"
STEP_BEGIN=`date +%H:%M:%S`" [Project BEGIN] 开始"
DIR_dist="./dist"
rm -rf $DIR_dist/*

DIR_build="./output"
DIR_subdir=$DIR_build/ultron

if [ ! -d $DIR_build ]; then
    echo "---------- add " $DIR_build " ----------"
    mkdir $DIR_build
fi

if [ ! -d $DIR_subdir ]; then
    echo "---------- add " $DIR_subdir " ----------"
    mkdir $DIR_subdir
fi

rm -rf $DIR_subdir/*

sh bin/release.sh

cp -r -f $DIR_dist/* $DIR_subdir

du -sh $DIR_build
find $DIR_build -type f -name '*.*' | wc -l

STEP_END=`date +%H:%M:%S`" [Project END] 结束时间"
echo $STEP_BEGIN_DATE
echo $STEP_BEGIN
echo $STEP_END
