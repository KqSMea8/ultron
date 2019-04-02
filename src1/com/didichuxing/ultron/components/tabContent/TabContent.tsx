import React, { Component } from 'react';
import 'antd/dist/antd.css';
import ReactDOM from 'react-dom';
import { Tree, Input, Icon, Table, Modal, Button, Tabs, Card } from 'antd';
import { getOdinTree } from '@ultron/remote/testTask';
import DataTransferComponent from 'com/didichuxing/components/DataTransferComponent';
import { BusinessDetailsExpandLineParams } from '@ultron/remote/testPressure';
import { EChartSimple } from 'com/didichuxing/commonInterface/AEChart';
import { createOption } from './ModelTabContent';
import { get } from 'com/didichuxing/utils/request';
import { Bind } from 'lodash-decorators';
import style from './TabContent.less';
import moment from 'moment';

interface ITabContentProps {
    detailData;
    updataDetailData;
    reportId: number;
    cluster: string;
    getModalData;
    modalData;
}

interface ITabContentState {
    topInItemActive: number;
    moduleId: number;
    loading: boolean;
    expandTableData;
    expandedTableTitleData;
    seatchValue: string;
    modalTitle: string;
    lineChartVisible: boolean;
    isFromInternalTableModal: boolean;
    cardLoading: boolean;
    modalData;
    record;
    tabsActiveKey: string;
}
/**
 * 将数字转换为千位符
 * @param num
 * @example 1000 => 1,000
 */
export const ParseNumToKbit = (num: string | number): string => {
    return num.toString().replace(/(\d{1,3})(?=(\d{3})+($|\.))/g, '$1,');
};
/**
 * 将数字转换为K、M、B、T
 * @param num 数字
 * @param hasPoint 是否保留两位小数位
 * @example 1000 => 1K
 */
export default class TabContent
extends DataTransferComponent<ITabContentProps, ITabContentState> {
    private expandTableData: any[] = [];
    private externalTableModalTabs: any[] = [
        {
            title: '接口流量高峰',
            key: 'serviceTraffic'
        },
        {
            title: 'cpu.idle',
            key: 'cpuIdle'
        },
        {
            title: 'mem.used.percent',
            key: 'memUsedPercent'
        }
    ];
    private internalTableModalTabs: any[] = [
        {
            title: '流量',
            key: 'interfaceTraffic'
        },
        {
            title: '时延',
            key: 'latency'
        },
        {
            title: '成功率',
            key: 'successRate'
        }
    ];
    constructor(props: ITabContentProps, context?: ITabContentState) {
        super(props, context);
        this.state = {
            topInItemActive: 1,
            moduleId: 999,
            loading: false,
            expandTableData: [],
            expandedTableTitleData: [],
            seatchValue: '',
            modalTitle: '',
            lineChartVisible: false,
            isFromInternalTableModal: false,
            cardLoading: false,
            modalData: {},
            record: {},
            tabsActiveKey: ''
        };
    }
    @Bind()
    private clickTopInItem(event) {
        this.setState({
            moduleId: 999,
            expandTableData: [],
            expandedTableTitleData: [],
            topInItemActive: +event.currentTarget.dataset['topinitem']
        }, this.updataDetailData);
    }
    /**
     * 更新detailData
     */
    @Bind()
    private updataDetailData() {
        this.props.updataDetailData(this.state.topInItemActive);
    }
    /**
     * 组装展开行标题
     */
    @Bind()
    private assembleExpandedTableTitle() {
        return (
            this.state.expandedTableTitleData.length
                ?
            this.state.expandedTableTitleData.map((item, index) => {
                return (
                    <span key={ index } className={ style.expandedTableTitle }>
                        <span className={ style.expandedTableTitleValueName }>{ item['name'] }</span>
                        :
                        <span className={ style.expandedTableTitleValue }>{ item['value'] }</span>
                    </span>
                );
            })
                :
            ''
        );
    }
    /**
     * 点击展开详情
     */
    @Bind()
    private expandDetails(event: React.MouseEvent<HTMLAnchorElement>) {
        const dataset: any = event.currentTarget.dataset;
        if (this.state.moduleId === +dataset['moduleid']) {
            this.setState({
                moduleId: 999
            });
            return;
        }
        this.setState({
            loading: true
        }, () => {
            BusinessDetailsExpandLineParams({
                topType: this.state.topInItemActive,
                cluster: this.props.cluster
            }, this.props.reportId || 1, +dataset['moduleid']).then((result) => {
                this.setState({
                    loading: false,
                    moduleId: +dataset['moduleid'],
                    expandTableData: result ? result['routerInterfaces'] : [],
                    expandedTableTitleData: result ? result['statistics'] : [],
                    seatchValue: ''
                });
            });
        });
    }
    /**
     * 点击搜索
     */
    @Bind()
    private interfaceTitleSearch(value: string) {
        if (!this.expandTableData.length) {
            this.expandTableData = this.state.expandTableData;
        }
        const newExpandTableData: any[] = [];
        if (value.trim() === '') {
            this.setState({
                expandTableData: this.expandTableData
            });
            return;
        }
        this.expandTableData.forEach((item) => {
            if (item['metricName'].toLowerCase().indexOf(value.trim().toLowerCase()) !== -1) {
                newExpandTableData.push(item);
            }
        });
        this.setState({
            expandTableData: newExpandTableData
        });
    }
    @Bind()
    private searchChange(event) {
        this.setState({
            seatchValue: event.target.value
        }, () => {
            this.interfaceTitleSearch(this.state.seatchValue);
        });
    }
    /**
     * 弹出echart对话框
     */
    @Bind()
    private async lineChart(event: React.MouseEvent<HTMLElement>) {
        const dataSet: any = event.currentTarget.dataset;
        this.setState({
            lineChartVisible: true,
            cardLoading: true,
            modalTitle: dataSet['modaltitle'],
            isFromInternalTableModal: dataSet['isfrominternaltablemodal'] === 'true' ? true : false,
            record: JSON.parse(dataSet['record']),
            tabsActiveKey: dataSet['tabsactivekey']
        }, async () => {
            await this.props.getModalData(+dataSet['metricid']);
            this.setState({
                cardLoading: false,
                modalData: this.props.modalData
            });
        });
    }
    /**
     * echart对话框确认健
     */
    @Bind()
    private cancelLineChart() {
        this.setState({
            lineChartVisible: false
        });
    }
    /**
     * 展开行
     */
    @Bind()
    private expandedRowRender(parentRecord) {
        const columns: any = [{
            title: (
                <div>
                    <span>接口</span>
                    <Input.Search
                        className={ style.interfaceTitle }
                        onSearch={ this.interfaceTitleSearch }
                        value={ this.state.seatchValue }
                        onChange={ this.searchChange }
                    />
                </div>
            ),
            dataIndex: 'metricName',
            key: 'metricName'
        }, {
            title: '流量(req/min)',
            dataIndex: 'interfaceTraffic',
            key: 'interfaceTraffic',
            align: 'right',
            render: (text, record) => {
                return (
                    text
                        ?
                    (
                    <div>
                        <span className={ style.record }>
                            { ParseNumToKbit(Math.round(text['value'] * 100) / 100) }
                        </span>
                        <Icon
                            onClick={ this.lineChart }
                            className={ style.lineChart }
                            type="line-chart"
                            data-moduleid={ parentRecord['moduleId'] }
                            data-metricid={ record['interfaceTraffic']['metricId'] }
                            data-modaltitle={ record['metricName'] }
                            data-tabsactivekey="interfaceTraffic"
                            data-isfrominternaltablemodal={ !!record['metricName'] }
                            data-record={ JSON.stringify(record) }
                        />
                    </div>
                    )
                        :
                    '--'
                  );
              }
        }, {
            title: '时延(ms)',
            dataIndex: 'latency',
            key: 'latency',
            align: 'right',
            render: (text, record) => {
                return (
                    text
                        ?
                    (
                    <div>
                        <span className={ style.record }>{ Math.round(text['value'] * 100) / 100 }</span>
                        <Icon
                            onClick={ this.lineChart }
                            className={ style.lineChart }
                            type="line-chart"
                            data-moduleid={ parentRecord['moduleId'] }
                            data-metricid={ record['latency']['metricId'] }
                            data-modaltitle={ record['metricName'] }
                            data-tabsactivekey="latency"
                            data-isfrominternaltablemodal={ !!record['metricName'] }
                            data-record={ JSON.stringify(record) }
                        />
                    </div>
                    )
                        :
                    '--'
                  );
              }
        }, {
            title: '成功率',
            dataIndex: 'successRate',
            key: 'successRate',
            align: 'right',
            render: (text, record) => {
                return (
                    text
                        ?
                    (
                    <div>
                        <span className={ style.record }>{ Math.round(text['value'] * 100) / 100 + '%' }</span>
                        <Icon
                            onClick={ this.lineChart }
                            className={ style.lineChart }
                            type="line-chart"
                            data-moduleid={ parentRecord['moduleId'] }
                            data-metricid={ record['successRate']['metricId'] }
                            data-modaltitle={ record['metricName'] }
                            data-tabsactivekey="successRate"
                            data-isfrominternaltablemodal={ !!record['metricName'] }
                            data-record={ JSON.stringify(record) }
                        />
                    </div>
                    )
                        :
                    '--'
                  );
              }
        }];
        return (
            <div className={ style.expandedTable }>
                <div className={ style.expandedTableTitle }>
                    {
                        this.assembleExpandedTableTitle()
                    }
                </div>
                <Table
                    loading={ this.state.loading }
                    rowKey="metricName"
                    columns={ columns }
                    dataSource={
                        this.state.expandTableData.sort((a, b) => {
                            return (
                                b['interfaceTraffic']['value'] - a['interfaceTraffic']['value']
                            );
                        })
                    }
                />
            </div>
        );
    }
    @Bind()
    private assembleTopIn() {
        const topIn: number[] = [1, 5, 10, 15, 30, 60];
        return (
            topIn.map((item, index) => {
                if (item !== 60) {
                    return (
                        <span
                            onClick={ this.clickTopInItem }
                            className={ `
                                ${style.topInItem}
                                ${this.state.topInItemActive === item ? style.topInItemActive : ''}
                                ` }
                            key={ item }
                            data-topinitem={ item }
                        >
                            { item } min
                        </span>
                    );
                } else {
                    return (
                        <span
                            onClick={ this.clickTopInItem }
                            className={ `
                                ${style.topInItem}
                                ${this.state.topInItemActive === item ? style.topInItemActive : ''}
                                ` }
                            key={ item }
                            data-topinitem={ item }
                        >
                            1 hour
                        </span>
                    );
                }
            })
        );
    }
    @Bind()
    private tabsChange(key) {
        this.setState({
            tabsActiveKey: key,
            cardLoading: true
        }, async () => {
            if (!this.state.record[key]) {
                this.setState({
                    cardLoading: false,
                    modalData: {}
                });
            } else {
                await this.props.getModalData(this.state.record[key]['metricId']);
                this.setState({
                    cardLoading: false,
                    modalData: this.props.modalData
                });
            }
        });
    }
    public render() {
        const columns: any = [{
            title: '服务模块',
            key: 'odin',
            dataIndex: 'odin'
          }, {
            title: '访问量(req/min)',
            key: 'serviceTraffic',
            dataIndex: 'serviceTraffic',
            align: 'right',
            width: 200,
            render: (text, record) => {
                return (
                    text
                        ?
                    (
                    <div>
                        <span
                            className={ style.record }
                        >
                            { ParseNumToKbit(Math.round(text['value'] * 100) / 100) }
                        </span>
                        <Icon
                            onClick={ this.lineChart }
                            className={ style.lineChart }
                            type="line-chart"
                            data-moduleid={ record['moduleId'] }
                            data-metricid={ record['serviceTraffic']['metricId'] }
                            data-modaltitle={ record['odin'] }
                            data-tabsactivekey="serviceTraffic"
                            data-isfrominternaltablemodal={ !!record['metricName'] }
                            data-record={ JSON.stringify(record) }
                        />
                    </div>
                    )
                        :
                    '--'
                );
            }
          }, {
            title: '机器资源高峰',
            children: [{
              title: 'cpu.idle',
              key: 'cpuIdle',
              dataIndex: 'cpuIdle',
              align: 'right',
              render: (text, record) => {
                  return (
                    text
                        ?
                    (
                    <div>
                        <span className={ style.record }>{ Math.round(text['value'] * 100) / 100 + '%' }</span>
                        <Icon
                            onClick={ this.lineChart }
                            className={ style.lineChart }
                            type="line-chart"
                            data-moduleid={ record['moduleId'] }
                            data-metricid={ record['cpuIdle']['metricId'] }
                            data-modaltitle={ record['odin'] }
                            data-tabsactivekey="cpuIdle"
                            data-isfrominternaltablemodal={ !!record['metricName'] }
                            data-record={ JSON.stringify(record) }
                        />
                    </div>
                    )
                        :
                    '--'
                  );
              },
              width: 200
            }, {
              title: 'mem.used.percent',
              key: 'memUsedPercent',
              dataIndex: 'memUsedPercent',
              align: 'right',
              render: (text, record) => {
                return (
                    text
                        ?
                    (
                    <div>
                        <span className={ style.record }>{ Math.round(text['value'] * 100) / 100 + '%' }</span>
                        <Icon
                            onClick={ this.lineChart }
                            className={ style.lineChart }
                            type="line-chart"
                            data-moduleid={ record['moduleId'] }
                            data-metricid={ record['memUsedPercent']['metricId'] }
                            data-modaltitle={ record['odin'] }
                            data-tabsactivekey="memUsedPercent"
                            data-isfrominternaltablemodal={ !!record['metricName'] }
                            data-record={ JSON.stringify(record) }
                        />
                    </div>
                    )
                        :
                    '--'
                  );
              },
              width: 200
            }]
          }, {
            title: '操作',
            key: 'moduleId',
            dataIndex: 'moduleId',
            width: 200,
            render: (text, record) => {
                return (
                    <span
                        onClick={ this.expandDetails }
                        className={ style.expandDetails }
                        data-moduleid={ text }
                    >
                        {
                            this.state.moduleId === text ? '收起' : '展开'
                        }
                    </span>
                );
            }
          }];
        const assembleTabPanes
        = this.state.isFromInternalTableModal ? this.internalTableModalTabs : this.externalTableModalTabs;
        return (
            <div className={ style.tabContent }>
                <div className={ style.topIn }>
                    Top in: {
                        this.assembleTopIn()
                    }
                </div>
                <div className={ style.table }>
                    <Table
                        loading={ this.state.loading }
                        rowKey="moduleId"
                        columns={ columns }
                        dataSource={ this.props.detailData.filter((item) => {
                            return item['serviceTraffic'];
                        }).sort((a, b) => {
                            if (a['serviceTraffic'] && b['serviceTraffic']) {
                                return (
                                    b['serviceTraffic']['value'] - a['serviceTraffic']['value']
                                );
                            } else {
                                return 1;
                            }
                        }).concat(
                            this.props.detailData.filter((item) => {
                                return !item['serviceTraffic'];
                            })
                        ) }
                        bordered={ true }
                        expandedRowRender={ this.expandedRowRender }
                        expandedRowKeys={ [this.state.moduleId] }
                    />
                </div>
                {
                    this.state.lineChartVisible &&
                    <Modal
                        bodyStyle={ {padding: '0 24px'} }
                        title={ this.state.modalTitle }
                        visible={ this.state.lineChartVisible }
                        onCancel={ this.cancelLineChart }
                        width={ 700 }
                        footer={ [
                            <Button key="primary" type="primary" onClick={ this.cancelLineChart }>确认</Button>
                        ] }
                    >
                        {
                            <Tabs onChange={ this.tabsChange } activeKey={ this.state.tabsActiveKey }>
                                {
                                    assembleTabPanes.map((item, index) => {
                                        return (
                                            <Tabs.TabPane
                                                tab={ item.title }
                                                key={ item.key }
                                            >
                                                <Card
                                                    bordered={ false }
                                                    loading={ this.state.cardLoading }
                                                    style={ { width: '100%', padding: '0 0 0 20px', marginTop: -10 } }
                                                    bodyStyle={ { padding: 0, height: 300 } }
                                                >
                                                {
                                                    Object.keys(this.state.modalData).length
                                                        ?
                                                    (
                                                        this.state.modalData.curve.length
                                                        ?
                                                        <EChartSimple
                                                            data={
                                                                createOption(
                                                                    this.state.modalData,
                                                                    this.state.tabsActiveKey
                                                                    )
                                                            }
                                                            height={ 300 }
                                                        />
                                                        :
                                                        <div className={ style.noEchartData }>没有数据</div>
                                                    )
                                                        :
                                                    <div className={ style.noEchartData }>没有数据</div>
                                                }
                                                </Card>
                                            </Tabs.TabPane>
                                        );
                                    })
                                }
                            </Tabs>
                        }
                    </Modal>
                }
            </div>
        );
    }
}
