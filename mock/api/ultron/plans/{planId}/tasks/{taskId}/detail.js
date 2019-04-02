/**
 * 查看压测任务详情
 */
export default {
    'GET /api/ultron/pressure/plans/*/tasks/*/detail': {
        "errno":0,
        "errmsg":"success",
        "data":{
            "taskId":2404,
            "status":40, //状态
            "region":1, //机房
            "startAt":1530002552,
            "stopAt":1530002924,
            "createUser":"",
            "pressure":{ //压力
                "type":3, //压力类型：1-固定QPS，2-固定并发，1-固定QPS，2-固定并发，3-阶梯QPS，4-阶梯并发
                "initThroughput":500, //初始QPS
                "lastThroughput":3000, //峰值QPS
                "increasePerStep":500, //每步增加
                "durationPerStep":60 //每步持续时间
            },
            "agents":[
                {
                    "id":2421,
                    "status":4, //状态
                    "agentId":2,
                    "agentRegion":1, //机房
                    "agentName":"agent01.ultron.com", //名称
                    "agentIp":"10.94.121.110", //IP
                    "agentPid":3991, //进程ID
                    "startAt":1530002552, //开始时间
                    "stopAt":1530002924 //结束时间
                }
            ]
        },
        "timestamp":1530338128
    }
}
