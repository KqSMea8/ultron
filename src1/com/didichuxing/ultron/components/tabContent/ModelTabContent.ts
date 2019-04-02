export const createOption = (data, tabsActiveKey) => {
    const units = {
        serviceTraffic: '流量(req/min)',
        interfaceTraffic: '流量(req/min)',
        latency: '耗时(ms)',
        successRate: '百分比(%)',
        cpuIdle: '百分比(%)',
        memUsedPercent: '百分比(%)'
    };
    const seriesData: any[] = [];
    data.curve.forEach((item) => {
        seriesData.push([+item.time * 1000, item.value]);
    });
    const option = {
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            bottom: 40,
            top: 40
        },
        xAxis: {
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            name: units[tabsActiveKey],
            type: 'value',
            nameTextStyle: {
                align: 'right'
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            min: (value) => {
                return Math.floor(value.min * 100) / 100;
            },
            max: (value) => {
                return Math.ceil(value.max * 100) / 100;
            }
        },
        series: [{
            data: seriesData,
            symbolSize: 1,
            type: 'line',
            lineStyle: {
                color: '#40a9ff'
            }
        }]
    };
    return option;
};
