/**
 * Created by lincal on 2017/6/1.
 */
"use strict"
const path     = require('path')
const basePath = path.resolve(__dirname, '../') // process.cwd()

const ENVS = {
    test  : "http://ultron-test.intra.xiaojukeji.com",
    online: "http://ultron.intra.xiaojukeji.com",
}

const
    port         = 7210,
    hostname     = ENVS.test,
    Proxy        = require("./Proxy")
    // mockDataPath = path.join(basePath, 'src/mock/remote')

new Proxy(hostname, port, null).start()
