/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The javascript of applicationContextLoader
 */

'use strict';

const stringifyObject = require('stringify-object');
const context = require('../resources/application-context.json');

module.exports = function (source, map, meta) {
    if (this.cacheable) {
        this.cacheable();
    }
    source = source.replace('public static readonly context: IApplicationContext;', (replacer) => {
        return `public static readonly context: IApplicationContext = ${
            stringifyObject(context, { indent: '  ', singleQuotes: true })
        };`;
    });
    this.callback(null, source, map, meta);
}
