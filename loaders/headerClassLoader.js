/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The javascript of headerClassLoader
 */

'use strict';

const context = require('../resources/application-context.json');

module.exports = function (source, map, meta) {
    if (this.cacheable) {
        this.cacheable();
    }
    if (context.header) {
        source = source.replace(/header:\s*React\.createElement\(NormalHeader,\s*{/, (replacer) => {
            return `header: React.createElement(require('${ context.header }').default, {`;
        });
    }
    this.callback(null, source, map, meta);
}
