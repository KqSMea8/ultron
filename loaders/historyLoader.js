/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The javascript of historyLoader
 */

'use strict';

module.exports = function (source, map, meta) {
    if (this.cacheable) {
        this.cacheable();
    }
    source = source.replace(/location = \(0, _PathUtils.parsePath\)\(path\);/, (replacer1) => {
        return `
            if (state && state.query) {
                state.search = require('query-string').stringify(state.query);
                delete state.query;
            }
            ${ replacer1 }
        `;
    }).replace(/location = _extends\({}, path\);/, (replacer2) => {
        return `
            if (path && path.query) {
                path.search = require('query-string').stringify(path.query);
                delete path.query;
            }
            ${ replacer2 }
        `;
    }).replace(/createPath\(location\)\s*{/, (replacer3) => {
        return `
            ${replacer3}
            if (location.query) {
                location.search = require('query-string').stringify(location.query);
                delete location.query;
            }
        `;
    });
    this.callback(null, source, map, meta);
}
