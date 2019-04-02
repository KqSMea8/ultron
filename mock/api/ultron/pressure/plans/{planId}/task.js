import Mock from 'mockjs';
/**
 * 查看压测任务列表
 */
export default {
    'GET /api/ultron/pressure/plans/*/tasks': Mock.mock({
        "errno":0,
        "errmsg":"success",
        "data":{
            "num":1,
            "size":10,
            "total":73,
            "results":[
                {
                    "taskId":2404,
                    "status":40, //状态
                    "region":1, //机房
                    "startAt":1530002552,
                    "stopAt":1530002924,
                    "createUser":"",
                    "pressure":{
                        "type":3, //压力类型：1-固定QPS，2-固定并发，1-固定QPS，2-固定并发，3-阶梯QPS，4-阶梯并发
                        "initThroughput":500, //初始QPS
                        "lastThroughput":3000, //峰值QPS
                        "increasePerStep":500, //每步增加
                        "durationPerStep":60 //每步持续时间
                    }
                }
            ]
        },
        "timestamp":1530338958
    })
}
