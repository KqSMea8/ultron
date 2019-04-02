/**
 * Created by lincal on 2017/6/1.
 */
"use strict"

const
    _          = require("lodash"),
    app        = require("express")(),
    axios      = require("axios"),
    bodyParser = require("body-parser"),
    QS         = require("qs")

function buildOptions(hostname, req) {
    let url           = hostname + req.url,
        method        = req.method,
        authorization = req.headers.authorization

    return {
        url,
        method,
        headers: {
            // "Authorization": authorization,
            "content-type" : req.headers['content-type'] || "application/json; charset=UTF-8"
        },
    }
}

function doRequest(res, options, getMockData) {
    console.log(_.padStart(options.method, 4, " "), options.url)
    //console.log(options)

    return axios(options)
        .then(resp => {
            setHead(res)
            let info = {
                code: resp.data.code,
                msg : resp.data.msg
            }
            console.log(JSON.stringify(info))
            let dataStr = JSON.stringify(resp.data)
            //console.log(dataStr.substr(0, Math.min(100, dataStr.length)))
            return res.end(dataStr)
        })
        .catch(error => {
            const pathname = res.req._parsedUrl.pathname
            console.log('======no======', pathname)
            console.log('======error======', error)
            if (getMockData != null) {
                const data = getMockData(pathname)
                if (data != null) {
                    return res.end(JSON.stringify(data))
                }
            }
            setHead(res, res.status)
            return res.end(JSON.stringify(error))
        })
}

function setHead(res, code) {
    code = code || 200
    res.writeHead(code, { "Content-Type": "application/json; charset=UTF-8" })
}

class Proxy {
    constructor(hostname, port, mockDataPath) {
        this.hostname     = hostname
        this.port         = port
        this.mockDataPath = mockDataPath
        console.log('Proxy.mockDataPath', this.mockDataPath)

        this.getMockData = (pathname) => {
            if (this.mockDataPath == null)
                return null

            const data = require(this.mockDataPath + '/' + pathname.substr(1, pathname.length - 1).replace(/\//g, '.'))
            return data
        }
    }

    start() {
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app
            .get("/*", (req, res, next) => {
                var options = buildOptions(this.hostname, req);
                doRequest(res, options, this.getMockData);
            })
            .post("/*", (req, res, next) => {
                var options = buildOptions(this.hostname, req);
                if (req.headers['content-type'] != null && req.headers['content-type'].indexOf('json') >= 0) {
                    options.data = JSON.stringify(req.body);
                }
                else {
                    options.data = QS.stringify(req.body);
                }
                doRequest(res, options, this.getMockData);
            })

        app.listen(this.port, () => {
            console.log(`Server started at http://127.0.0.1:${this.port}`)
        })
    }
}

// exports.default = Proxy
module.exports = Proxy;
