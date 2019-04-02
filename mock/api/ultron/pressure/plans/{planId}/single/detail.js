/**
 * 获取单接口压测计划详情
 */
export default {
    'GET /api/ultron/pressure/plans/*/single/detail': {
        "errno": 0,
        "errmsg": "success",
        "data": {
            "headers": {
                "AAAA": "test"
            },
            "method": "GET",
            "more": {
                "fileName": "plan280.csv", //文件名称
                "keepAlive": true, //保持长连接
                "timeout": 5000, //超时时间
                "maxRedirects": 0 //重定向次数
            },
            "planName": "hd_test_url_0918",
            "pressureMode": 1,
            "groupNumber": 5,
            "url": "http://100.69.185.15:8001/testget?uid=${uid}",
            "groupName": "H5",
            "pressureType": 2,
            "planId": 280,
            "createUser": ""
        },
        "timestamp": 1530327921
    }
}