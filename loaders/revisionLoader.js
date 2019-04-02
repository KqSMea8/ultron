/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The javascript of revisionLoader
 */

'use strict';

const path = require('path');
const context = require('../resources/application-context.json');

const logoAndAppNameRegExp = /<InlineSVG src="logo"/;

module.exports = function (source, map, meta) {
    if (this.cacheable) {
        this.cacheable();
    }
    if (logoAndAppNameRegExp.test(source)) {
        source = source.replace(logoAndAppNameRegExp, `<InlineSVG src={ require('${ context.logo }') }`);
    }
    this.callback(null, source, map, meta);
}
