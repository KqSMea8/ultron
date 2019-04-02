/**
 * 更新单接口压测计划
 */
export default {
    'POST /api/ultron/pressure/plans/*/single/update': {
        "errno": 0,
        "errmsg": "success",
        "data": {
            "headers": {
                "Content-Type": "application/json;charset=UTF-8"
            },
            "method": "POST",
            "more": {
                "fileName": "test1.csv",
                "keepAlive": false,
                "timeout": 3000,
                "maxRedirects": 10
            },
            "planName": "create_single_test",
            "pressureMode": 1,
            "body": "{\"a\":3}",
            "groupNumber": 5,
            "url": "http://100.69.185.15:8001/test/jmeter/createOrder",
            "cookies": {},
            "groupName": "H5",
            "pressureType": 2,
            "planId": 477,
            "createUser": ""
        },
        "timestamp": 1530332468
    }
}