/**
 * 获取场景压测计划详情
 */
export default {
    'GET /api/ultron/pressure/plans/*/scene/detail': {
        "errno": 0,
        "errmsg": "success",
        "data": {
            "groupName": "H5",
            "contents": "[\"GET||http://100.69.185.15:8001/test/jmeter/createOrder||||||\",\"#set($orderCode=$response.data.orderCode)\"]",
            "fileName": "/home/xiaoju/data/logs/test.csv",
            "more": {
                "keepAlive": true,
                "timeout": 5000,
                "maxRedirects": 0
            },
            "pressureType": 2,
            "planName": "场景压测test21",
            "planId": 464,
            "createUser": "",
            "pressureMode": 3,
            "groupNumber": 5
        },
        "timestamp": 1530328401
    }
}