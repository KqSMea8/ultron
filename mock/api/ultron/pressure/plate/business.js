/**
 * 创建业务容量
 */
export default {
    'GET /api/ultron/pressure/plate/business': {
        "errno": 0,
        "errmsg": "success",
        "data": [
            {
                "businessName":"专快",
                "modules":[
                    {
                        "moduleName":"预估",
                        "estimateCapacity":60,
                        "actualCapacity":40,
                        "unit": "w/min"
                    },
                    {
                        "moduleName":"发单",
                        "estimateCapacity":9,
                        "actualCapacity":7.78,
                        "unit": "w/min"
                    },
                    {
                        "moduleName":"司机在线",
                        "estimateCapacity":70,
                        "actualCapacity":70,
                        "unit": "w"
                    }
                ]
            },
            {
                "businessName":"Soda",
                "modules":[
                    {
                        "moduleName":"日订单",
                        "estimateCapacity":300,
                        "actualCapacity":300,
                        "unit": "w"
                    }
                ]
            },
            {
                "businessName":"品质出行",
                "modules":[
                    {
                        "moduleName":"海棠湾-日订单",
                        "estimateCapacity":560,
                        "actualCapacity":800,
                        "unit": "w"
                    },
                    {
                        "moduleName":"代驾-日订单",
                        "estimateCapacity":100,
                        "actualCapacity":72,
                        "unit": "w"
                    },
                    {
                        "moduleName":"黑马-日订单",
                        "estimateCapacity":60,
                        "actualCapacity":26,
                        "unit": "w"
                    }
                ]
            }
        ],
        "timestamp": 1536309315
    }
}