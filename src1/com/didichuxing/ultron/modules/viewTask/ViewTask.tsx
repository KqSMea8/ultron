/**
 * Created by didi on 2018/7/4.
 */
import React from 'react';
import Modal from '@antd/modal';
import Button from '@antd/button';
import Input from '@antd/input';
import Tabs from '@antd/tabs';
import Table from '@antd/table';
import Select from '@antd/select';
import Radio from '@antd/radio';
import Spin from '@antd/spin';
import Breadcrumb from '@antd/breadcrumb';
import Icon from '@antd/icon';
import { AModule } from 'com/didichuxing/commonInterface/AModule';
import ModelTaskDetails from '@ultron/modules/viewTask/ModelTask';
import { observer } from 'mobx-react';
import style from './ViewTask.less';
import { Bind } from 'lodash-decorators';
import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';

import { ErrorListItem } from '@ultron/modules/viewTask/ModelTaskErrorList';
import { Link } from 'react-router-dom';
import { showTestModes } from '@ultron/business/modelTestMode/views/ViewTestModes';

const InputGroup = Input.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const ObsSelectTime = bindObserver(Select, 'selectTime', 'value');

const COL_SETTINGS = [
    { title: '机房', dataIndex: 'vRegion', key: 'vRegion' },
    { title: '名称', dataIndex: 'vAgentName', key: 'vAgentName' },
    { title: 'IP', dataIndex: 'vIp', key: 'vIp' },
    { title: 'PID', dataIndex: 'vAgentPid', key: 'vAgentPid' },
    { title: '启动时间', dataIndex: 'vStartAt', key: 'vStartAt' },
    { title: '停止时间', dataIndex: 'vStopAt', key: 'vStopAt' },
    { title: '状态', dataIndex: 'vStatus', key: 'vStatus' }
];

@observer
export default class ViewTaskDetails extends AModule<ModelTaskDetails> {
    private inst?: any;
    private columnsApi = [
        { title: '数量', dataIndex: 'vNumber', key: 'vNumber', width: '100px' },
        { title: '错误码', dataIndex: 'vCode', key: 'vCode' },
        { title: '错误原因', dataIndex: 'vMessage', key: 'vMessage' },
        {
            title: 'Trace',
            dataIndex: 'vTrace',
            key: 'vTrace',
            render: (text, record) => {
                return (
                    <a
                        href={ 'http://bamai.xiaojukeji.com/search/trace?key=' + text + '&index=allindex' }
                        target="_blank"
                        style={ { textDecoration: 'none', color: '#666' } }
                    >
                        { text }
                    </a>
                );
            }
        },
        {
            title: '详情', dataIndex: 'vDetail', key: 'vDetail', width: '60px', render: (text, record: ErrorListItem) => {
            const onClick = () => {
                this.toConfigDetail(record.item.detail);
            };
            return (
                <a style={ { color: '#1890ff' } } onClick={ onClick }>
                    {
                        record.item.detail === '' ? '' : '详情'
                    }
                </a>
            );
        }
        }
    ];

    constructor(props, context) {
        super(props, context);
    }

    protected createModel(): ModelTaskDetails {
        return new ModelTaskDetails(this.query);
    }

    public componentDidMount(): void {
        this.model.loadData();
    }

    private  renderMonitor(model) {
        this.model = model;
        this.model.all = [];
        this.model.perfList.forEach((value) => {
            this.model.all.push({ value });
        });

        this.model.errors.forEach((value) => {
            this.model.all.forEach((item) => {
                if (item.value.url === value.errorUrl) {
                    item.item = value;
                }
            });
        });
        if (this.model.all.length < 1) {
            this.model.all.push({});
        }
        return (
            <div>
                {
                    this.model.all.map((item, index) => {
                        return (
                            <div key={ index }>
                                {
                                    item.value ? item.value.renderView() : (
                                        <div className={ style.empty }>
                                            暂无url数据
                                            <a href="javascript:;" onClick={ this.refresh }>点击刷新</a>
                                        </div>
                                    )
                                }
                                {
                                    String(this.model.type) === '4' ? item.item ? this.renderError(item.item) : (
                                        <div
                                            className={ style.empty }
                                            style={ { marginTop: '10px', marginBottom: '10px' } }
                                        >
                                            暂无错误数据
                                            <a href="javascript:;" onClick={ this.refresh }>点击刷新</a>
                                        </div>
                                    ) : null
                                }
                            </div>
                        );
                    })
                }

            </div>
        );
    }

    @Bind()
    private refresh() {
        this.model.loadData();
    }

    @Bind()
    private toConfigDetail(detailes): void {
        this.inst = Modal.info({
            width: 900,
            maskClosable: true,
            title: '错误信息详情',
            content: (
                <div className={ style.addModel }>
                    { detailes }
                </div>
            )
        });
    }

    @Bind()
    private async updateTestMode(): Promise<void> {
        this.model.beginTestModeUpdating();
        try {
            await showTestModes(
                this.model.planId,
                this.model.pressureMode,
                this.model.taskId,
                this.model.valDataTestMode,
                this.model.region);
            this.model.loadData();
        } finally {
            this.model.endTestModeUpdating();
        }
    }

    @Bind()
    private setSelectTime(val): void {
        // this.model.setSelectTime(val);
    }

    @Bind()
    private setTabKey(val): void {
        this.model.setTabKey(val);
        // if (val === '2') {
        //     if (this.model.perfList[0]) {
        //         this.model.perfList[0].showHide = 'block';
        //     }
        // }
        this.push();
    }
    @Bind()
    private stopTask(): void {
        const This = this;
        Modal.confirm({
            title: '确定要停止该压测么？',
            onOk() {
                This.model.stopTask();
            }
        });
    }

    private renderError(error) {
        return (
            <div key={ error.key } className={ style.bodyTab } style={ { marginTop: '10px', marginBottom: '10px' } }>
                <div className={ style.center }>错误统计</div>
                <div>
                    <Table
                        columns={ this.columnsApi }
                        bordered={ true }
                        dataSource={ error.errorList }
                        className={ style.tableList }
                        pagination={ false }
                    />
                </div>
            </div>
        );
    }
    public render(): React.ReactNode {
        return (
            <div className={ style.ViewDetails }>
                <div className={ style.ViewBox }>
                    <div className={ style.bread }>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to="/new.html/ultron/interfaceTest">
                                    <Icon type="usb"/>接口级压测
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link to={ this.model.vConfigUrl }>
                                    { this.model.planName || '计划详情' }
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                任务 { this.model.taskId }
                                <span className={ style.blue }>{ this.model.vStatus }</span>
                                {
                                    Number(this.model.unassignedAgentNum) > 0 ? (
                                        <span>
                                            <span
                                                style={ { color: 'red', marginLeft: '10px', marginRight: '10px'} }
                                            >可用Agent不足，请稍等
                                            </span>
                                            <Spin spinning={ true } size="small"/>
                                        </span>
                                    ) : null
                                }
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className={ style.breadButton }>
                        <Button
                            type="primary"
                            disabled={ this.model.vIsButtonDisabled }
                            onClick={ this.updateTestMode }
                            loading={ this.model.isTestModeUpdating }
                        >
                            调整压力
                        </Button>
                        <Button
                            type="primary"
                            disabled={ this.model.vIsButtonDisabled }
                            onClick={ this.stopTask }
                            loading={ this.model.isStopping }
                        >
                            停止压测
                        </Button>
                    </div>
                </div>
                <div className={ style.tabs }>
                    <Tabs type="card" activeKey={ this.model.tabKey } onChange={ this.setTabKey }>
                        <TabPane tab="基本信息" key="1">
                            <div className={ style.headerNameValue }>
                                <div className={ style.details }>
                                    <div className={ style.box }>
                                        <div className={ style.header }>压力详情</div>
                                        <div className={ style.height }>
                                            <div className={ style.start }>
                                                <span className={ style.txt }>启动时间:</span>
                                                <ul className={ style.left }>
                                                    <li>
                                                        <span>{ this.model.vStartTime }</span>
                                                        <div className={ style.detailTestMode }>
                                                            {
                                                                this.model.modelTestMode &&
                                                                this.model.modelTestMode.renderDetail()
                                                            }
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className={ style.start }>
                                                <span className={ style.txt }>停止时间:</span>
                                                <div className={ style.left }>
                                                    <span>{ this.model.vStopTime }</span>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                                    <span>{ this.model.vStatus }</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className={ style.header }>
                                            压测Agents
                                        </div>
                                        <div className={ style.backcolor }>
                                            <Table
                                                columns={ COL_SETTINGS }
                                                bordered={ true }
                                                dataSource={ this.model.list }
                                                pagination={ false }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="接口监控" key="2">
                            { this.renderMonitor(this.model) }
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}
