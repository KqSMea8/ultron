#!/usr/bin/env bash

current_dir=$(cd "$(dirname "$0")";pwd)
tmp_dir=${current_dir}/../__tmp__
target_dir=${current_dir}/../dist

npm run build:pre

# check the dist folder exist or not
# if not, it will create one.
if [ ! -d ${target_dir} ]; then
    mkdir ${target_dir}
fi

# copy the tmp folder to the dist
cp -r ${tmp_dir}/* ${target_dir}/

# remove the tmp folder.
rm -rf ${tmp_dir}
