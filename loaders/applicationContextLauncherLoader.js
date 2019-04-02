/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The javascript of applicationContextLauncherLoader
 */

'use strict';

const context = require('../resources/application-context.json');

module.exports = function (source, map, meta) {
    if (this.cacheable) {
        this.cacheable();
    }
    if (process.env.NODE_ENV !== 'production' || process.env.PRE === 'true') { // 非线上环境
        source = `
            const expireDate: Date = new Date();
            expireDate.setFullYear(expireDate.getFullYear() + 1);
            require('js-cookie').set('username', '', {
                path: '/',
                expires: expireDate
            });
            require('js-cookie').set('JSESSIONID', '601CD060879E3A4813C362F73853E8A3', {
                path: '/',
                expires: expireDate
            });
            ${source}
        `;
    }
    if (!/(\/|^)NormalDynamicContextLauncher$/.test(context.contextLauncher)) {
        source = source.replace('this.dynamicContextLauncher = new NormalDynamicContextLauncher();', (replacer) => {
            return `this.dynamicContextLauncher = new (require('${ context.contextLauncher }').default)();`;
        });
    }
    this.callback(null, source, map, meta);
}
