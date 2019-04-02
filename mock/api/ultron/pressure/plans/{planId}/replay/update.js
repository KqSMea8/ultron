/**
 * 更新多接口压测计划
 */
export default {
    'POST /api/ultron/pressure/plans/*/replay/update': {
        "errno": 0,
        "errmsg": "success",
        "data": {
            "headers": {
                "Content-Type": "application/json;charset=UTF-8"
            },
            "urlPrefix": [],
            "more": {
                "keepAlive": false,
                "timeout": 3000,
                "maxRedirects": 10
            },
            "filePath": "/home/xiaoju/webroot/pressure-platform/application/library/requestScript/result/111.txt",
            "serverAddress": "thrift://100.69.111.44:8009?timeout=50000",
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
        "timestamp": 1530332788
    }
}