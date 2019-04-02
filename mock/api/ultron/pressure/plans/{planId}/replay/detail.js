/**
 * 获取多接口压测计划详情
 */
export default {
    'GET /api/ultron/pressure/plans/*/replay/detail': {
        "errno": 0,
        "errmsg": "success",
        "data": {
            "headers": {
                "Content-Type": "application/json;charset=utf-8"
            },
            "urlPrefix": [
                "http://10.94.96.212:8000"
            ],
            "more": {
                "keepAlive": true,
                "timeout": 10000,
                "maxRedirects": 10
            },
            "filePath": "/home/xiaoju/webroot/pressure-platform/application/library/requestScript/result/getalltraveltime.txt", //文件路径
            "serverAddress": "thrift://100.69.111.43:8009?timeout=50000", //服务地址
            "planName": "公交-1511838113499",
            "pressureMode": 2,
            "isDefaultServerAddress": true, //是否为默认服务
            "groupNumber": 4,
            "groupName": "公交",
            "pressureType": 2,
            "planId": 307,
            "createUser": ""
        },
        "timestamp": 1530328224
    }
}