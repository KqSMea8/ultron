/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The javascript of antdStyleLoader
 */

'use strict';

const path = require('path');
const fs = require('fs');

const styleCache = {};

module.exports = function (source, map, meta) {
    if (this.cacheable) {
        this.cacheable();
    }
    source = source.replace(/'@antd\/([A-Za-z1-9\/\-]+)'/g, (item) => {
        let newItem = item.replace(/\'/g, '');
        if (/@antd\/grid/.test(newItem)) {
            newItem = '@antd/grid';
        }
        if (Object.prototype.toString.call(styleCache[newItem]) !== '[object Boolean]') {
            styleCache[newItem] = fs.existsSync(`${newItem.replace('@antd', path.resolve(__dirname, '../node_modules/antd/es'))}/style/index.js`);
        }
        if (styleCache[newItem]) {
            return `${item};import '${newItem}/style/index.js'`;
        }
        return item;
    });
    this.callback(null, source, map, meta);
}
