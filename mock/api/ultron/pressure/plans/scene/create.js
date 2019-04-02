/**
 * 创建场景压测
 */
export default {
    'POST /api/ultron/pressure/plans/scene/create': {
        "errno": 0,
        "errmsg": "success",
        "data": {
            "groupName": "公交",
            "contents": "[\"GET||http://100.69.185.15:8001/test/jmeter/createOrder||||||\",\"#set($orderCode=$response.data.orderCode)\",\"#set($sleep=1)\",\"GET||http://100.69.185.15:8001/test/jmeter/queryOrder?orderCode=${orderCode}||||||\"]",
            "more": {
                "fileName" : "test.csv",
                "keepAlive": true,
                "timeout": 5000,
                "maxRedirects": 0
            },
            "pressureType": 2,
            "planName": "create_test_scene",
            "planId": 481,
            "createUser": "",
            "pressureMode": 3,
            "groupNumber": 4
        },
        "timestamp": 1530331836
    }
}