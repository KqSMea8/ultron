/**
 * 开始压测
 */
export default {
    'POST /api/ultron/pressure/plans/*/tasks/create': {
        "errno":0,
        "errmsg":"success",
        "data":{
            "taskId":2416,
            "region":1,
            "status":10,
            "startAt":0,
            "stopAt":0,
            "createUser":"",
            "pressure":{ //压力
                "type":4, //压力类型：1-固定QPS，2-固定并发，3-阶梯QPS，4-阶梯并发
                "initConcurrency":100, //初始并发
                "lastConcurrency":100, //峰值并发
                "increasePerStep":100, //每步增加
                "durationPerStep":100 //每步持续时间
            }
        },
        "timestamp":1530341632
    }
}
