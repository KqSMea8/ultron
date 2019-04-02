import Mock from 'mockjs';

/**
 * 查询压测计划（分页）
 */
export default {
    'GET /api/ultron/pressure/plans/list':  Mock.mock({
        "errno": 0,
        "errmsg": "success",
        "data": {
            "num": 1, //等于 输入page字段
            "size": 3, //等于 输入size字段
            "total": 123, //总数
            "results|10": [{
                "planId": 162, //压测计划ID
                "planName": "http-1499332497866", //压测计划名称
                "groupNumber": 15, //所属组
                "groupName": "OpenH5", //所属组名称
                "pressureType": 2, //压测类型
                "pressureMode|1-3": 3, //压测方式
                "createUser": "lisong", //创建人
                "pressureCount|1-99": 99, //压测次数
                "taskId": 491, //最近一次压测任务ID
                "status": 40, //最近一次压测任务状态
                "pressureTime|1499934701-1509934701": 1509934701 //压测时间
            }]
        },
        "timestamp": 1530322525199
    })
};
