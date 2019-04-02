/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The javascript of thor.mock.js
 */

import path from 'path';
import glob from 'glob';

const PROXY_TARGET = 'http://ultron-test.intra.xiaojukeji.com/';
const _U_SESSION_ID_ = '05f336093dc04915bd2639b991297d86';
const JSESSIONID = '327F7F1E3E03A87687EE386AAA94B9D1';

const IS_OPEN_PROXY = process.env.NO_PROXY === 'true';

const mockData = {};
glob.sync('**/*.js', { cwd: path.join(__dirname, './mock') }).forEach(function(file) {
    Object.assign(mockData, require('./mock/' + file).default);
});

const proxyObj = {
    origin: PROXY_TARGET,
    headers: {
        Cookie: '_ga=GA1.2.553627596.1504524666;percentage=0.25;username=username_v;_U_SESSION_ID_=' + _U_SESSION_ID_ + ';JSESSIONID=' + JSESSIONID
    }
};

export default (IS_OPEN_PROXY ? {
    'GET  /ultronProxy/': proxyObj,
    'POST /ultronProxy/': proxyObj,
    'PUT  /ultronProxy/': proxyObj
} : mockData);
