/**
 * 错误数
 */
export default {
    'GET /api/ultron/plans/{planId}/tasks/{taskId}/http/errors': {
        "errno": "0000",
        "errmsg": "success",
        "data": {
            "planId": 71,
            "taskId": 383,
            "errors": [
                {
                    "url": "/gulfstream/api/v1/driver/dSetOnlineStatus",
                    "data": [
                        {
                            "code": "5701",
                            "count": 3,
                            "type": "Http",
                            "message": "抱歉，当前车辆正在被邵师傅出车中，您暂时不能出车；如果您还有其它车辆，请到‘我-\u003e我的车辆’更换车辆",
                            "detail": "",
                            "traceId": "6445b7529f32854c177f005303144f99",
                            "uid": 703687560856855
                        }
                    ]
                }
            ]
        },
        "timestamp": 1497321031049
    }
}
