import React from 'react';
import Modal from '@antd/modal';
import Button from '@antd/button';
import Input from '@antd/input';
import Tabs from '@antd/tabs';
import Table from '@antd/table';

import style from './TestConfigList.less';
import {AModule} from 'com/didichuxing/commonInterface/AModule';
import {observer} from 'mobx-react';
import {bindObserver} from 'com/didichuxing/commonInterface/TwoWayBinding';
import {Bind} from 'lodash-decorators';
import {getCookie} from '@ultron/business/common/http/cookies';
import ModelTestConfigList, {ModelListItem} from '@ultron/modules/testConfigList/ModelTestConfigList';
import {ETestTaskState} from '@ultron/business/common/enum/ETestTaskState';
import Alert from '@antd/alert';

const TabPane = Tabs.TabPane;

const ObsInputSearchAll = bindObserver(Input.Search, 'keywordAll', 'value');
const ObsInputSearchMine = bindObserver(Input.Search, 'keywordMine', 'value');

@observer
export default class TestConfigList extends AModule<ModelTestConfigList> {
    private inst?: any;
    private COL_SETTINGSMINE = [
        {
            title: '名称', dataIndex: 'vName', key: 'vName', render: (text, record: ModelListItem) => {
            const onClick = () => {
                this.toConfigDetail(record.vUrlConfig, record.item.planId, record.vName);
            };
            return (
                <span>
                        <a href="javascript:;" onClick={ onClick }>{ text }</a>
                    </span>
            );
        }
        },
        {title: '类型', dataIndex: 'vTestType', key: 'vTestType'},
        {title: '所属业务线', dataIndex: 'vGroup', key: 'vGroup'},
        {
            title: '状态', dataIndex: 'vTestState', key: 'vTestState', render: (text, record: ModelListItem) => {
            if (record.item.status === ETestTaskState.Running) {
                const onClick = () => {
                    this.toTaskDetail(record.vUrlTask,
                        record.item.planId, record.item.taskId, String(record.item.pressureMode),
                        record.item.planName
                    );
                };
                return (
                    <span>
                        <a href="javascript:;" onClick={ onClick }>{ text }({ record.item.taskId })</a>
                    </span>
                );
            } else {
                return record.vTestState;
            }
        }
        },
        {title: '创建人', dataIndex: 'vCreator', key: 'vCreator'},
        {title: '累计压测次数', dataIndex: 'vTestCount', key: 'vTestCount'},
        {title: '压测时间', dataIndex: 'vTestTime', key: 'vTestTime'},
        {
            title: '操作', key: 'vHandle', render: (text, record: any) => {
            const deleteClick = () => {
                this.deletePlan(record.item.planId);
            };
            const copyClick = () => {
                this.copyPlan(record.item.planId, record.item.pressureMode, record.item.pressureType);
            };
            return (
                <div>
                    {
                        record.item.status === 40 || record.item.status === 0 ? (
                            <a
                                onClick={ deleteClick }
                                style={ { marginRight: '10px'} }
                            >
                                删除
                            </a>
                        ) : null
                    }
                    <a
                        onClick={ copyClick }
                    >
                        复制
                    </a>
                </div>
                );
            }
        }
    ];
    private COL_SETTINGSALL = [
        {
            title: '名称', dataIndex: 'vName', key: 'vName', render: (text, record: ModelListItem) => {
            const onClick = () => {
                this.toConfigDetail(record.vUrlConfig, record.item.planId, record.vName);
            };
            return (
                <span>
                        <a href="javascript:;" onClick={ onClick }>{ text }</a>
                    </span>
            );
        }
        },
        {title: '类型', dataIndex: 'vTestType', key: 'vTestType'},
        {title: '所属业务线', dataIndex: 'vGroup', key: 'vGroup'},
        {
            title: '状态', dataIndex: 'vTestState', key: 'vTestState', render: (text, record: ModelListItem) => {
            if (record.item.status === ETestTaskState.Running) {
                const onClick = () => {
                    this.toTaskDetail(record.vUrlTask,
                        record.item.planId, record.item.taskId, String(record.item.pressureMode),
                        record.item.planName
                    );
                };
                return (
                    <span>
                        <a href="javascript:;" onClick={ onClick }>{ text }({ record.item.taskId })</a>
                    </span>
                );
            } else {
                return record.vTestState;
            }
        }
        },
        {title: '创建人', dataIndex: 'vCreator', key: 'vCreator'},
        {title: '累计压测次数', dataIndex: 'vTestCount', key: 'vTestCount'},
        {title: '压测时间', dataIndex: 'vTestTime', key: 'vTestTime'}
    ];

    constructor(props, context) {
        super(props, context);
    }

    protected createModel(): ModelTestConfigList {
        return new ModelTestConfigList(this.query);
    }

    /**
     * 删除压测计划
     */
    @Bind()
    private deletePlan(val): void {
        Modal.confirm({
            width: 400,
            title: '确定删除此压测计划么？',
            onOk: () => {
                this.model.deletePlan(val);
            }
        });
    }

    /**
     * 复制压测计划
     * @param val
     * @param pressureMode
     * @param pressureType
     */
    @Bind()
    private copyPlan(val, pressureMode, pressureType): void {
        const query = {
            cloneId: val
        };
        if (Number(pressureMode) === 1 && Number(pressureType) === 2) {
            this.push({url: '/ultron/interfaceTest/httpSingle', query});
        } else if (Number(pressureMode) === 2 && Number(pressureType) === 2) {
            this.push({url: '/ultron/interfaceTest/httpMulti', query});
        } else if (Number(pressureMode) === 3 && Number(pressureType) === 2) {
            this.push({url: '/ultron/interfaceTest/httpScene', query});
        } else if (Number(pressureMode) === 1 && Number(pressureType) === 4) {
            this.push({url: '/ultron/interfaceTest/thrift', query});
        }
    }

    /**
     * 跳转到http接口
     */
    @Bind()
    private toHttpSingle(): void {
        this.inst && this.inst.destroy && this.inst.destroy();
        this.push({url: '/ultron/interfaceTest/httpSingle'});
    }

    /**
     * 跳转到http日志回放
     */
    @Bind()
    private toHttpMulti(): void {
        this.inst && this.inst.destroy && this.inst.destroy();
        this.push({url: '/ultron/interfaceTest/httpMulti'});
    }

    /**
     * 跳转到http场景
     */
    @Bind()
    private toHttpScene(): void {
        this.inst && this.inst.destroy && this.inst.destroy();
        this.push({url: '/ultron/interfaceTest/httpScene'});
    }

    /**
     * 跳转到thrift接口
     */
    @Bind()
    private toThrift(): void {
        this.inst && this.inst.destroy && this.inst.destroy();
        this.push({url: '/ultron/interfaceTest/thrift'});
    }

    @Bind()
    private toConfigDetail(url: string, planId: number, planName: string): void {
        this.inst && this.inst.destroy && this.inst.destroy();
        this.push({url, query: {planId, planName}});
    }

    @Bind()
    private toTaskDetail(url: string, planId: number, taskId: number, type: string, planName: string): void {
        this.inst && this.inst.destroy && this.inst.destroy();
        this.push({url, query: {planId, taskId, type, planName}});
    }

    @Bind()
    private showAdd(): void {
        this.inst = Modal.info({
            width: 600,
            // destroyOnClose: true,
            maskClosable: true,
            // closable: true,
            // footer: null,
            title: '新建压测配置',
            className: style.addNewModelBox,
            content: (
                <div className={ style.addNewModel }>
                    <Button type="primary" onClick={ this.toHttpSingle }>HTTP接口</Button>
                    <Button type="primary" onClick={ this.toHttpMulti }>HTTP日志回放</Button>
                    <Button type="primary" onClick={ this.toHttpScene }>HTTP场景</Button>
                    <Button type="primary" onClick={ this.toThrift }>Thrift接口</Button>
                </div>
            )
        });
    }

    @Bind()
    private setKeywordAll(evt): void {
        this.model.setKeywordAll(evt.target.value);
    }

    @Bind()
    private setKeywordMine(evt): void {
        this.model.setKeywordMine(evt.target.value);
    }

    @Bind()
    private onClickQuery(): void {
        this.model.loadData();
        this.push();
    }

    @Bind()
    private onPageChange(pageNo: number): void {
        this.model.toPage(pageNo);
        this.push();
    }

    @Bind()
    private onTabChange(key: string): void {
        switch (key) {
            default:
            case '1':
                this.model.setUserName('');
                break;
            case '2':
                this.model.setUserName(getCookie().username || 'lisong');
                break;
        }
        this.push();
    }

    public componentDidMount(): void {
        this.model.loadData();
    }

    private renderTableMine(): React.ReactNode {
        return (
            <Table
                columns={ this.COL_SETTINGSMINE }
                bordered={ true }
                dataSource={ this.model.list }
                pagination={
                    {
                        current: this.model.vPage,
                        pageSize: this.model.SIZE,
                        total: this.model.total,
                        onChange: this.onPageChange
                    }
                }
                loading={ this.model.loading }
            />
        );
    }
    private renderTableAll(): React.ReactNode {
        return (
            <Table
                columns={ this.COL_SETTINGSALL }
                bordered={ true }
                dataSource={ this.model.list }
                pagination={
                    {
                        current: this.model.vPage,
                        pageSize: this.model.SIZE,
                        total: this.model.total,
                        onChange: this.onPageChange
                    }
                }
                loading={ this.model.loading }
            />
        );
    }

    public render(): React.ReactNode {
        return (
            <div className={ style.taskList }>
                <div className={ style.tabBox }>
                    <Button type="primary" className={ style.new } onClick={ this.showAdd }>新建</Button>
                    <Tabs type="card" defaultActiveKey={ this.model.vTabKey } onChange={ this.onTabChange }>
                        <TabPane tab="我的压测" key="2">
                            <div className={ style.bodyTab }>
                                <div className={ style.query }>
                                    <ObsInputSearchMine
                                        model={ this.model }
                                        style={ {width: '24%'} }
                                        placeholder="输入名称或者创建人"
                                        enterButton="查询"
                                        onChange={ this.setKeywordMine }
                                        onSearch={ this.onClickQuery }
                                    />
                                </div>
                                { this.renderTableMine() }
                            </div>
                        </TabPane>
                        <TabPane tab="所有压测" key="1">
                            <div className={ style.headerNameValue }>
                                <div className={ style.query }>
                                    <ObsInputSearchAll
                                        model={ this.model }
                                        style={ {width: '24%'} }
                                        placeholder="输入名称或者创建人"
                                        enterButton="查询"
                                        onChange={ this.setKeywordAll }
                                        onSearch={ this.onClickQuery }
                                    />
                                </div>
                                { this.renderTableAll() }
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}
