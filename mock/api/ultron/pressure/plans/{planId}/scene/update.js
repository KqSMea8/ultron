/**
 * 更新场景压测计划
 */
export default {
    'POST /api/ultron/pressure/plans/*/scene/update': {
        "errno": 0,
        "errmsg": "success",
        "data": {
            "groupName": "公交",
            "contents": "[\"GET||http://100.69.185.15:8001/test/jmeter/createOrder||||||\",\"#set($orderCode=$response.data.orderCode)\",\"#set($sleep=1)\"]",
            "more": {
                "fileName": "test1.csv",
                "keepAlive": false,
                "timeout": 3000,
                "maxRedirects": 10
            },
            "pressureType": 2,
            "planName": "create_test_scene",
            "planId": 481,
            "createUser": "",
            "pressureMode": 3,
            "groupNumber": 4
        },
        "timestamp": 1530332950
    }
}