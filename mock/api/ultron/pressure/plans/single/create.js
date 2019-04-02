/**
 * 创建单接口压测
 */
export default {
    'POST /api/ultron/pressure/plans/single/create': {
        "errno": 0,
        "errmsg": "success",
        "data": {
            "headers": {
                "Content-Type": "application/json;charset=UTF-8"
            },
            "method": "POST",
            "more": {
                "fileName": "test.csv",
                "keepAlive": true,
                "timeout": 5000,
                "maxRedirects": 0
            },
            "planName": "create_single_test",
            "pressureMode": 1,
            "body": "{\"a\":1}",
            "groupNumber": 5,
            "url": "http://100.69.185.15:8001/test/jmeter/createOrder",
            "cookies": {},
            "groupName": "H5",
            "pressureType": 2,
            "planId": 477,
            "createUser": ""
        },
        "timestamp": 1530329815
    }
}
