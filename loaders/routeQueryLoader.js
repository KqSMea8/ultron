/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The javascript of RouteQueryLoader
 */

'use strict';

module.exports = function (source, map, meta) {
    if (this.cacheable) {
        this.cacheable();
    }
    source = source.replace(
        /* eslint-disable */
        /var\s+props\s*=\s*{\s*match:\s*match,\s*location:\s*location,\s*history:\s*history,\s*staticContext:\s*staticContext\s*};/,
        /* eslint-enable */
        (replacer) => {
            return `${ replacer }
                props = _extends(props, { query: require('query-string').parse(location.search) });
            `;
        }
    );
    this.callback(null, source, map, meta);
}

