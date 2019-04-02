/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The javascript of applicationContextLoader
 */

'use strict';

const context = require('../resources/application-context.json');

const collections = {};
function collectRoutes(parentPath, routeConfig) {
    for (const i in routeConfig) {
        const routeConfigValue = routeConfig[i];
        if (routeConfigValue) {
            const path = `${parentPath}${i}`.replace(/\/+/, '/');
            switch (Object.prototype.toString.call(routeConfigValue)) {
                case '[object String]': // leaf node
                    collections[path] = {
                        componentClassName: routeConfigValue,
                        isLeaf: true
                    };
                    break;
                case '[object Object]':
                    if (routeConfigValue.component) {
                        collections[path] = {
                            componentClassName: routeConfigValue.component
                        }
                        if (routeConfigValue.routes && JSON.stringify(routeConfigValue.routes) !== '{}') {
                            collections[path].isLeaf = false;
                            collectRoutes(path, routeConfigValue.routes);
                        } else { // leaf node
                            collections[path].isLeaf = true;
                        }
                    }
                    break;
            }
        }
    }
}

collectRoutes('', context.routes);

module.exports = function (source, map, meta) {
    if (this.cacheable) {
        this.cacheable();
    }
    source = source.replace(
        'const pathAndComponentClassNameMapping: { [path: string]: IPathDetail } = {}',
        (replaceValue) => {
            return `const pathAndComponentClassNameMapping: { [path: string]: IPathDetail } = ${
                JSON.stringify(collections)
            }`;
        }
    );
    this.callback(null, source, map, meta);
};
