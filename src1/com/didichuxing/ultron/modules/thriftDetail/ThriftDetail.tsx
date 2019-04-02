import React from 'react';
import Button from '@antd/button';
import Input from '@antd/input';
import Tabs from '@antd/tabs';
import Checkbox from '@antd/checkbox';
import Row from '@antd/row';
import Col from '@antd/col';
import Card from '@antd/card';
import Select from '@antd/select';
import Table from '@antd/table';
import style from './ThriftDetail.less';
import ModelThriftTask, { ModelListItem } from '@ultron/modules/thriftDetail/MThriftDetail';
import ModalFileContent from '@ultron/modules/thriftDetail/modalFileContent/ModalFileContent';
import { AModule } from 'com/didichuxing/commonInterface/AModule';
import { observer } from 'mobx-react';
import { Bind } from 'lodash-decorators';
import { showTestModes } from '@ultron/business/modelTestMode/views/ViewTestModes';
import { Link } from 'react-router-dom';
import Breadcrumb from '@antd/breadcrumb';
import Icon from '@antd/icon';
import Radio from '@antd/radio';
import message from '@antd/message';
import Modal from '@antd/modal';

const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const storage = window.localStorage;
let isModalShow = true;

@observer
export default class ThriftTask extends AModule<ModelThriftTask> {
    private inst?: any;
    private COL_SETTINGS = [
        {
            title: '压测ID', dataIndex: 'vTaskId', key: 'vTaskId', render: (text, record: ModelListItem) => {
            const onClick = () => {
                this.toTaskDetail(
                    this.model.planId,
                    String(record.item.taskId),
                    String(this.model.modelConfigThrift.type),
                    this.model.modelConfigThrift.planName
                );
            };
            return (
                <span>
                        <a href="javascript:;" onClick={ onClick }>{ text }</a>
                    </span>
            );
        }
        },
        { title: '压测时间', dataIndex: 'vTestTime', key: 'vTestTime' },
        { title: '操作人', dataIndex: 'vCreateUser', key: 'vCreateUser' },
        { title: '机房', dataIndex: 'vRegion', key: 'vRegion'},
        { title: '压力', dataIndex: 'vPressure', key: 'vPressure' },
        { title: '状态', dataIndex: 'vStatus', key: 'vStatus' },
        {
            title: '操作', render: (text, record: any) => {
                const deleteClick = () => {
                    this.deleteTask(record.item.taskId);
                };
                return (
                    <div>
                        {
                            record.item.status === 40 ? (
                                <a onClick={ deleteClick }>
                                    删除
                                </a>
                            ) : null
                        }
                    </div>
                );
            }
        }
    ];

    constructor(props, context) {
        super(props, context);
    }

    protected createModel(): ModelThriftTask {
        return new ModelThriftTask(this.query);
    }
    /**
     * 删除压测任务
     */
    @Bind()
    private deleteTask(val): void {
        Modal.confirm({
            width: 400,
            title: '确定删除此压测任务么？',
            onOk: () => {
                this.model.deleteTask(val);
            }
        });
    }

    @Bind()
    private titleTaskList() { return '压测记录'; }

    @Bind()
    private toTaskDetail(planId: string, taskId: string, type: string, planName: string): void {
        this.push({ url: '/ultron/interfaceTest/taskDetail', query: { planId, taskId, type, planName } });
    }
    @Bind()
    public ifTip(evt): void {
        const planIdList: any = JSON.parse(storage.getItem('planIdList') as any) || [];
        if (evt.target.checked) {
            planIdList.push(+this.model.planId);
            storage.setItem('planIdList', JSON.stringify(planIdList));
        } else {
            planIdList.pop();
            storage.setItem('planIdList', JSON.stringify(planIdList));
        }
    }

    @Bind()
    private showTestMode() {
        const planIdList: any = JSON.parse(storage.getItem('planIdList') as any) || [];
        planIdList.includes(+this.model.planId) ? isModalShow = false : isModalShow = true;
        const that = this;
        if (isModalShow) {
            Modal.info({
                title: '压测线上系统时，请避开高峰期，并通知上下游模块负责人。',
                width: 540,
                content: (
                    <div>
                        <Checkbox onChange={ this.ifTip }>
                            不再提醒
                        </Checkbox>
                    </div>
                ),
                onOk() {
                    showTestModes(that.model.planId).then((taskId) => {
                        that.model.setTaskId(taskId);
                        that.model.loadDataList();
                    });
                }
            });
        } else {
            // 折线图
            showTestModes(that.model.planId).then((taskId) => {
                that.model.setTaskId(taskId);
                that.model.loadDataList();
            });
        }
    }

    @Bind()
    private toConfigEdit(): void {
        const query = {
            planId: this.model.planId,
            planName: this.model.modelConfigThrift.planName
        };
        this.push({ url: '/ultron/interfaceTest/thrift', query });
    }

    @Bind()
    private onPageChange(pageNo: number): void {
        this.model.toPage(pageNo);
        this.push();
    }

    public componentDidMount(): void {
        this.model.loadData();
    }
    @Bind()
    private showType(val): string {
        switch (val) {
            case 1:
                return 'bool';
            case 2:
                return 'byte';
            case 3:
                return 'i16';
            case 4:
                return 'i32';
            case 5:
                return 'i64';
            case 6:
                return 'double';
            case 7:
                return 'string';
            case 8:
                return 'list';
            case 9:
                return 'map';
            case 10:
                return 'set';
            case 11:
                return 'struct';
            case 12:
                return 'trace';
            default :
                return '';
        }
    }

    private buttonRender(): React.ReactNode {
        if (this.model.flag) {
            return (
                <Link to={ this.model.vUrlTaskDetails }>
                    任务{ this.model.taskIds }待运行，查看详情
                </Link>
            );
        } else if (this.model.taskId) {
            return (
                <Link to={ this.model.vUrlTaskDetail }>
                    任务{ this.model.taskId }运行中，查看详情
                </Link>
            );
        } else {
            return (
                <div>
                    <Button className={ style.launchPressure } onClick={ this.showTestMode }>
                        发起压测</Button>
                    <Button type="primary" onClick={ this.toConfigEdit }>编辑压测</Button>
                </div>
            );
        }
    }

    @Bind()
    public search(e): void {
        if (e.keyCode === 13) {
            if (this.model.modelConfigThrift.moreConfig.numberInput === '') {
                message.error('起始行不能为空');
            } else {
                this.model.modelConfigThrift.numberInput();
            }
        }
    }
    @Bind()
    private see(): void {
        this.model.modelConfigThrift.moreConfig.numberInput = '';
        // this.model.modelConfigThrift.moreConfig.fileContentArr = [];
        this.model.modelConfigThrift.getNumberInput();
        Modal.info({
            title: '请输入要查看的行号',
            width: 800,
            okText: '取消',
            content: (
                <ModalFileContent model={ this.model }/>
            )
        });
    }
    private fileRender(): React.ReactNode {
        const fileType = this.model.modelConfigThrift.moreConfig.fileType;
        if (fileType === '0') {
            return (
                <div>
                    <div style={ { marginTop: '10px'} }>
                        <span>文件路径</span>
                        <Input
                            defaultValue={ this.model.modelConfigThrift.moreConfig.path }
                            style={ { width: '20%', marginLeft: '10px', marginBottom: '15px' } }
                            disabled={ true }
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div style={ { marginTop: '10px'} }>
                        自定义变量&nbsp;
                        <Input
                            defaultValue={ this.model.modelConfigThrift.moreConfig.fileName }
                            style={ { width: '20%' } }
                            disabled={ true }
                        />
                        {
                            this.model.modelConfigThrift.moreConfig.uploadPath !== '' ? (
                                <Button
                                    style={ { marginLeft: '15px'} }
                                    onClick={ this.see }
                                >
                                    查看文件
                                </Button>
                            ) : null
                        }
                    </div>
                </div>
            );
        }
    }

    public render(): React.ReactNode {
        return (
            <div className={ style.singleTask }>
                <div className={ style.pressureBox }>
                    <div className={ style.httpSingle }>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to="/new.html/ultron/interfaceTest">
                                    <Icon type="usb"/>接口级压测
                                </Link>
                            </Breadcrumb.Item>
                            { /*<Breadcrumb.Item>*/ }
                            { /*{ this.model.modelConfigHttpSingle.valType }*/ }
                            { /*</Breadcrumb.Item>*/ }
                            <Breadcrumb.Item>{ this.model.modelConfigThrift.planName }</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className={ style.pressureButton }>
                        {
                            this.buttonRender()
                        }
                    </div>
                </div>
                <div className={ style.thriftBox }>
                    <div className={ style.method }>
                        <Input
                            style={ { width: '15%' } }
                            value={ this.model.modelConfigThrift.vProtocolType }
                            disabled={ true }
                        />
                        <Input
                            style={ { width: '80%' } }
                            disabled={ true }
                            value={ this.model.modelConfigThrift.ipList }
                        />
                        <Input
                            style={ { width: '5%' } }
                            disabled={ true }
                            value={ this.model.modelConfigThrift.port }
                        />
                    </div>
                    <div className={ style.idl }>
                        <span className={ style.idlSpan }>Idl文件路径:</span>
                        <Input
                            disabled={ true }
                            style={ { width: '93%' } }
                            value={ this.model.modelConfigThrift.idlName }
                        />
                    </div>
                    <div className={ style.serverName }>
                        <span className={ style.serverNameSpan }>服务名称:</span>
                        <Input
                            disabled={ true }
                            style={ { width: '93%' } }
                            value={ this.model.modelConfigThrift.service }
                        />
                    </div>
                    <div className={ style.methodName }>
                        <span className={ style.methodNameSpan }>方法名称:</span>
                        <Input
                            disabled={ true }
                            style={ { width: '93%' } }
                            value={ this.model.modelConfigThrift.method }
                        />
                    </div>
                    <div className={ style.httpContent }>
                        <Tabs type="line">
                            <TabPane tab="参数" key="1">
                                <div style={ { height: '220px' } }>
                                <pre>
                                    {
                                        this.model.modelConfigThrift.parameterConfigs.getList().map((it, index) => {
                                            return <Row key={ index } gutter={ 11 } style={ {marginBottom: '10px'} }>
                                                <Col span={ 1 }>
                                                    <span
                                                        className={ style.index }
                                                    >
                                                        { index + 1 } ：
                                                    </span>
                                                </Col>
                                                <Col span={ 3 } style={ { paddingLeft: '0'} }>
                                                    <Input
                                                        disabled={ true }
                                                        value={ it.name }
                                                    />
                                                </Col>
                                                <Col span={ 2 }>
                                                    <Select
                                                        defaultValue={ this.showType(Number(it.type)) }
                                                        disabled={ true }
                                                        style={ {width: '100%'} }
                                                    />
                                                </Col>
                                                <Col span={ 5 }>
                                                    <Input disabled={ true } value={ it.value } />
                                                </Col>
                                            </Row>;
                                        })
                                    }
                                </pre>
                                </div>
                            </TabPane>
                            <TabPane tab="更多配置" key="2">
                                <div style={ { height: '220px' } }>
                                    <div className={ style.task }>超时时间：
                                        <span>
                                            { this.model.modelConfigThrift.moreConfig.timeoutSecond }
                                        </span>&nbsp;毫秒
                                    </div>
                                    <div className={ style.task }>
                                        <Checkbox
                                            defaultChecked={ this.model.modelConfigThrift.moreConfig.ifMulti }
                                            disabled={ true }
                                        />&nbsp;是否指定远端服务名称&nbsp;
                                        {
                                            this.model.modelConfigThrift.moreConfig.ifMulti === true ? (
                                                <Input
                                                    disabled={ true }
                                                    value={ this.model.modelConfigThrift.moreConfig.serviceName }
                                                    style={ { width: '302px' } }
                                                />
                                            ) : null
                                        }
                                    </div>
                                    <div>
                                        <Checkbox
                                            defaultChecked={ this.model.modelConfigThrift.moreConfig.ifNeed }
                                            disabled={ true }
                                        />
                                        &nbsp;是否使用参数服务
                                    </div>
                                    <div>
                                        {
                                            this.model.modelConfigThrift.moreConfig.ifNeed === true ? (
                                                <div style={ { marginTop: '10px'} }>
                                                    <div>
                                                        <RadioGroup
                                                            value={
                                                                this.model.modelConfigThrift.moreConfig.fileType
                                                            }
                                                            disabled={ true }
                                                        >
                                                            <Radio value={ '1' }>默认服务</Radio>
                                                            <Radio value={ '0' }>自定义服务</Radio>
                                                        </RadioGroup>
                                                        {
                                                            this.model.modelConfigThrift.moreConfig.fileType === '0' ? (
                                                                <Input
                                                                    defaultValue={
                                                                        this.model.modelConfigThrift.moreConfig.ip
                                                                    }
                                                                    style={ { width: '19.5%' } }
                                                                    disabled={ true }
                                                                />
                                                            ) : null
                                                        }
                                                        {
                                                            this.model.modelConfigThrift.moreConfig.ip !== '' &&
                                                            this.model.modelConfigThrift.moreConfig.path !== ''
                                                                ? (
                                                                <Button
                                                                    style={ { marginLeft: '15px'} }
                                                                    onClick={ this.see }
                                                                >
                                                                    查看文件
                                                                </Button>
                                                            ) : null
                                                        }
                                                    </div>
                                                    <div>
                                                        { this.fileRender() }
                                                    </div>
                                                </div>
                                            ) : null
                                        }
                                    </div>
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
                <div>
                    <Table
                        columns={ this.COL_SETTINGS }
                        dataSource={ this.model.list }
                        bordered={ true }
                        title={ this.titleTaskList }
                        pagination={
                            {
                                current: this.model.vPage,
                                pageSize: this.model.SIZE,
                                total: this.model.total,
                                onChange: this.onPageChange
                            }
                        }
                    />
                </div>
            </div>
        );
    }
}
