/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The javascript of routeConfigLoader
 */

'use strict';

const context = require('../resources/application-context.json');

const packs = new Set();

function collectRoutes(parentPath, routeConfig) {
    for (const i in routeConfig) {
        const routeConfigValue = routeConfig[i];
        if (routeConfigValue) {
            const path = `${parentPath}${i}`.replace(/\/+/, '/');
            switch (Object.prototype.toString.call(routeConfigValue)) {
                case '[object String]':
                    packs.add(routeConfigValue);
                    break;
                case '[object Object]':
                    packs.add(routeConfigValue.component);
                    if (routeConfigValue.component) {
                        if (routeConfigValue.routes && JSON.stringify(routeConfigValue.routes) !== '{}') {
                            collectRoutes(path, routeConfigValue.routes);
                        }
                    }
                    break;
            }
        }
    }
}

collectRoutes('', context.routes);
const packArr = Array.from(packs);

module.exports = function (source, map, meta) {
    if (this.cacheable) {
        this.cacheable();
    }
    const relative = source.indexOf('class RouteArea') > -1 ? '../../../' : './';

    const codeArr = packArr.map((it, index) => {
        const nameArr = it.split('/');
        const name = nameArr[nameArr.length - 1];
        const filename = name.length > 10 ? (name.substr(0, 10) + index) : name;

        const code = `
        ['${it}']: () => {
            return import(/* webpackChunkName: "${filename}" */\`${relative}${it}\`);
        }`;
        return code;
    });

    source = `
        const AppRouterMap = { ${codeArr.join(',') } };
        ${source.replace('import(`./${componentClassName}`)',
        'AppRouterMap[componentClassName] && AppRouterMap[componentClassName]()')}
    `;
    this.callback(null, source, map, meta);
};
