/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The javascript of requestLoader
 */

'use strict';

const context = require('../resources/application-context.json');

module.exports = function (source, map, meta) {
    if (this.cacheable) {
        this.cacheable();
    }
    const responseBodyKey = context.responseBodyKey;
    if (responseBodyKey) {
        const keys = [];
        if (responseBodyKey.dataKey) {
            keys.push(`dataKey:'${responseBodyKey.dataKey}'`);
        }
        if (responseBodyKey.errorMsgKey) {
            keys.push(`errorMsgKey:'${responseBodyKey.errorMsgKey}'`);
        }
        if (responseBodyKey.errorCodeKey) {
            keys.push(`errorCodeKey:'${responseBodyKey.errorCodeKey}'`);
        }
        if (keys.length) {
            source = source.replace(
                'const responseBodyKey: IResponseBodyKey = defaultResponseBodyKey;',
                (replacer) => {
                    return `const responseBodyKey: IResponseBodyKey = { ...defaultResponseBodyKey, ...{${
                        keys.join(',')
                    }} };`;
                }
            );
        }
    }
    this.callback(null, source, map, meta);
}
