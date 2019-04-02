/**
 * 创建多接口压测
 */
export default {
    'POST /api/ultron/pressure/plans/replay/create': {
        "errno": 0,
        "errmsg": "success",
        "data": {
            "headers": {
                "Content-Type": "application/json;charset=UTF-8"
            },
            "urlPrefix": [],
            "more": {
                "keepAlive": true,
                "timeout": 5000,
                "maxRedirects": 0
            },
            "filePath": "/home/xiaoju/webroot/pressure-platform/application/library/requestScript/result/getalltraveltime.txt",
            "serverAddress": "thrift://100.69.111.43:8009?timeout=50000",
            "planName": "create_replay_test",
            "pressureMode": 2,
            "isDefaultServerAddress": true,
            "groupNumber": 4,
            "cookies": {},
            "groupName": "公交",
            "pressureType": 2,
            "planId": 478,
            "createUser": ""
        },
        "timestamp": 1530330708
    }
}