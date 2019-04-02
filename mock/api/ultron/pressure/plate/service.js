/**
 * 创建服务容量
 */
export default {
    'GET /ultron/pressure/plate/service': {
        "errno": 0,
        "errmsg": "success",
        "data": [
            {
                "businessName":"业务平台",
                "modules":[
                    {
                        "moduleName":"预估子链路",
                        "estimateCapacity":60,
                        "actualCapacity":40,
                        "unit": "w/min"
                    },
                    {
                        "moduleName":"pope-driver",
                        "estimateCapacity":5,
                        "actualCapacity":5,
                        "unit": "w"
                    },
                    {
                        "moduleName":"pope-司机运营",
                        "estimateCapacity":1500,
                        "actualCapacity":500,
                        "unit": "QPS"
                    }
                ]
            },
            {
                "businessName":"公共平台",
                "modules":[
                    {
                        "moduleName":"账单子链路",
                        "estimateCapacity":60,
                        "actualCapacity":40,
                        "unit": "w/min"
                    },
                    {
                        "moduleName":"券",
                        "estimateCapacity":120,
                        "actualCapacity":417,
                        "unit": "w/min"
                    },
                    {
                        "moduleName":"收银",
                        "estimateCapacity":340,
                        "actualCapacity":700,
                        "unit": "w/min"
                    },
                    {
                        "moduleName":"支付",
                        "estimateCapacity":52,
                        "actualCapacity":20,
                        "unit": "w/min"
                    },
                    {
                        "moduleName":"顶导",
                        "estimateCapacity":60,
                        "actualCapacity":30,
                        "unit": "w/min"
                    },
                    {
                        "moduleName":"Passport-登录",
                        "estimateCapacity":150,
                        "actualCapacity":0,
                        "unit": "w/min"
                    },
                    {
                        "moduleName":"Passport-鉴权",
                        "estimateCapacity":4200,
                        "actualCapacity":1980,
                        "unit": "w/min"
                    },
                    {
                        "moduleName":"uranus",
                        "estimateCapacity":45,
                        "actualCapacity":45,
                        "unit": "w/min"
                    }
                ]
            },
            {
                "businessName":"地图",
                "modules":[
                    {
                        "moduleName":"点体系",
                        "estimateCapacity":4.8,
                        "actualCapacity":4,
                        "unit": "w/min",
                        "comment": "峰值1.5倍"
                    },
                    {
                        "moduleName":"线体系",
                        "estimateCapacity":24,
                        "actualCapacity":24,
                        "unit": "w/s"
                    }
                ]
            },
            {
                "businessName":"Duse",
                "modules":[
                    {
                        "moduleName":"选单大厅",
                        "estimateCapacity":4000,
                        "actualCapacity":1000,
                        "unit": "QPS"
                    },
                    {
                        "moduleName":"拼车预匹配",
                        "estimateCapacity":22,
                        "actualCapacity":24,
                        "unit": "w/min"
                    }
                ]
            },
            {
                "businessName":"安全",
                "modules":[
                    {
                        "moduleName":"SSO",
                        "estimateCapacity":2200,
                        "actualCapacity":3000,
                        "unit": "QPS"
                    },
                    {
                        "moduleName":"风控系统",
                        "estimateCapacity":0,
                        "actualCapacity":7000,
                        "unit": "QPS"
                    },
                    {
                        "moduleName":"newton",
                        "estimateCapacity":0,
                        "actualCapacity":2400,
                        "unit": "w次/日",
                        "comment": "峰值3倍"
                    }
                ]
            }
        ],
        "timestamp": 1536309315
    }
}