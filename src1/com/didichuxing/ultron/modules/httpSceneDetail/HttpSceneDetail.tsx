import React from 'react';
import Button from '@antd/button';
import Tabs from '@antd/tabs';
import Checkbox from '@antd/checkbox';
import Table from '@antd/table';
import style from './HttpSceneDetail.less';
import ModelSceneTask, { ModelListItem } from '@ultron/modules/httpSceneDetail/MHttpSceneDetail';
import ModalFileContent from '@ultron/modules/httpSceneDetail/modalFileContent/ModalFileContent';
import { AModule } from 'com/didichuxing/commonInterface/AModule';
import { observer } from 'mobx-react';
import Breadcrumb from '@antd/breadcrumb';
import Icon from '@antd/icon';
import { Link } from 'react-router-dom';
import { Bind } from 'lodash-decorators';
import { showTestModes } from '@ultron/business/modelTestMode/views/ViewTestModes';
import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';
import Radio from '@antd/radio';
import Input from '@antd/input';
import message from '@antd/message';
import Modal from '@antd/modal';
import Select from '@antd/select';

const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

const ObsApiSelect = bindObserver(Select, 'apiValue', 'value');
const storage = window.localStorage;
let isModalShow = true;

@observer
export default class SceneTask extends AModule<ModelSceneTask> {
    private COL_SETTINGS = [
        {
            title: '压测ID', dataIndex: 'vTaskId', key: 'vTaskId', render: (text, record: ModelListItem) => {
                const onClick = () => {
                    this.toTaskDetail(
                        this.model.planId,
                        String(record.item.taskId),
                        String(this.model.modelConfigScene.type),
                        this.model.modelConfigScene.planName,
                        this.model.modelConfigScene.pressureMode,
                        this.model.modelConfigScene.moreConfig.businessNum
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
                                <a
                                    onClick={ deleteClick }
                                >
                                    删除
                                </a>
                            ) : null
                        }
                    </div>
                );
            }
        }
    ];
    private COL_SETTINGSS = [
        { title: '压测ID', dataIndex: 'vTaskIds', key: 'vTaskIds', render: (text, record) => {
            const onClick = () => {
                this.toTaskDetail(
                    this.model.planId,
                    String(record.item.taskId),
                    String(this.model.modelConfigScene.type),
                    this.model.modelConfigScene.planName,
                    this.model.modelConfigScene.pressureMode,
                    this.model.modelConfigScene.moreConfig.businessNum
                );
            };
            return (
                <span>
                    <a href="javascript:;" onClick={ onClick }>{ text }</a>
                </span>
            );
        }
        },
        { title: '压测日期', dataIndex: 'vTestTimes', key: 'vTestTimes' },
        { title: '请求总数', dataIndex: 'vTotal', key: 'vTotal' },
        { title: '峰值QPS', dataIndex: 'vTopQPS', key: 'vTopQPS' },
        { title: '平均耗时', dataIndex: 'vAvg', key: 'vAvg'},
        { title: 'HTTP状态码', children: [] },
        { title: '', children: []}
    ];

    constructor(props, context) {
        super(props, context);
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
    private titleTaskList() {
        return(
            <span style={ { marginLeft: '16px'} }>压测记录</span>
        );
    }
    @Bind()
    private titleTaskLists() {
        return (
            <div>
                <div
                    style={ {
                        borderBottom: '1px solid #e8e8e8',
                        marginBottom: '5px',
                        paddingBottom: '10px'
                    } }
                >
                    <span style={ { marginLeft: '16px'} }>压测结果</span>
                </div>
                <div style={ { marginTop: '10px'} }>
                    <span style={ { marginLeft: '16px'} }>接口：</span>
                    <ObsApiSelect
                        model={ this.model }
                        onChange={ this.setApiChange }
                        style={ { minWidth: '180px' } }
                    >
                        {
                            this.model.apiArr.map((item, index) => {
                                return (
                                    <Option key={ index } value={ item }>{ item }</Option>
                                );
                            })
                        }
                    </ObsApiSelect>
                    <a
                        href={
                            '/ultronProxy/pressure/plans/'
                            + this.model.planId + '/reports/download' }
                        style={ {
                            float: 'right',
                            marginRight: '16px',
                            marginTop: '5px',
                            textDecoration: 'none'
                        } }
                    >
                        下载
                    </a>
                </div>
            </div>
        );
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
                    showTestModes(that.model.planId, that.model.modelConfigScene.pressureMode).then((taskId) => {
                        that.model.setTaskId(taskId);
                        that.model.loadDataList();
                    });
                }
            });
        } else {
            // 折线图
            showTestModes(that.model.planId, that.model.modelConfigScene.pressureMode).then((taskId) => {
                that.model.setTaskId(taskId);
                that.model.loadDataList();
            });
        }
    }

    protected createModel(): ModelSceneTask {
        return new ModelSceneTask(this.query);
    }

    @Bind()
    private toTaskDetail(
        planId: string, taskId: string, type: string, planName: string, pressureMode: number, businessCode: string
    ): void {
        this.push({ url: '/ultron/interfaceTest/taskDetail', query: {
            planId, taskId, type, planName, pressureMode, businessCode
        } });
    }

    @Bind()
    private toConfigEdit(): void {
        const query = {
            planId: this.model.planId,
            planName: this.model.modelConfigScene.planName
        };
        this.push({ url: '/ultron/interfaceTest/httpScene', query });
    }

    @Bind()
    private onPageChange(pageNo: number): void {
        this.model.toPage(pageNo);
        this.push();
    }

    public componentDidMount(): void {
        this.model.loadData();
        this.model.loadDataApi();
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
            if (this.model.modelConfigScene.moreConfig.numberInput === '') {
                message.error('起始行不能为空');
            } else {
                this.model.modelConfigScene.numberInput();
            }
        }
    }
    @Bind()
    private see(): void {
        this.model.modelConfigScene.moreConfig.numberInput = '';
        // this.model.modelConfigScene.moreConfig.fileContentArr = [];
        this.model.modelConfigScene.getNumberInput();
        Modal.info({
            title: '请输入要查看的行号',
            width: 800,
            okText: '取消',
            content: (
                <ModalFileContent model={ this.model }/>
            )
        });
    }

    @Bind()
    private setApiChange(val): void {
        this.model.setApiChange(val);
    }
    private fileRender(): React.ReactNode {
        const fileType = this.model.modelConfigScene.moreConfig.fileType;
        if (fileType === '0') {
            return (
                <div>
                    <div style={ { marginTop: '10px'} }>
                        <span>文件路径</span>
                        <Input
                            defaultValue={ this.model.modelConfigScene.moreConfig.path }
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
                            defaultValue={ this.model.modelConfigScene.moreConfig.fileName }
                            style={ { width: '20%' } }
                            disabled={ true }
                        />
                        {
                            this.model.modelConfigScene.moreConfig.uploadPath !== ''
                            && this.model.modelConfigScene.moreConfig.uploadPath ? (
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

    private setColumnsChildren(): void {
        const statusCounts: string[] = [];
        const childrenList = [] as any;
        const testArr = [] as any;
        this.model.lists.forEach((it) => {
            const listStatus = it.item.status_counts;
            const statusJson = typeof listStatus === 'string' ? JSON.parse(listStatus) : listStatus;
            for (const key in statusJson) {
                if (key) {
                    testArr.push(key);
                }
            }
        });
        if (testArr.length > 0) {
            this.model.lists.forEach((list) => {
                const listStatus = list.item.status_counts;
                const statusJson = typeof listStatus === 'string' ? JSON.parse(listStatus) : listStatus;
                for (const key in statusJson) {
                    if (statusJson.hasOwnProperty(key)) {
                        const hasKey = childrenList.find((info) => info.key === key);
                        !hasKey && childrenList.push({
                            key: key,
                            title: key,
                            dataIndex: 'status_counts',
                            render: (text, record, index) => {
                                const recordStatus = record.item.status_counts;
                                const recordJson = typeof recordStatus === 'string' ?
                                    JSON.parse(recordStatus) : recordStatus;
                                if (recordJson[key]) {
                                    let num = (recordJson[key]).toString();
                                    let result = '';
                                    while (num.length > 3) {
                                        result = ',' + num.slice(-3) + result;
                                        num = num.slice(0, num.length - 3);
                                    }
                                    if (num) { result = num + result; }
                                    return result;
                                }
                                // return recordJson[key];
                            }
                        });
                    }
                }
            });
        } else {
            this.model.lists.forEach((list) => {
                const statusJson = {'': ''};
                for (const key in statusJson) {
                    if (statusJson.hasOwnProperty(key)) {
                        const hasKey = childrenList.find((info) => info.key === key);
                        !hasKey && childrenList.push({
                            key: key,
                            title: key,
                            dataIndex: 'status_counts',
                            render: (text, record, index) => {
                                const recordStatus = record.item.status_counts;
                                const recordJson = typeof recordStatus === 'string' ?
                                    JSON.parse(recordStatus) : recordStatus;
                                return recordJson[key];
                            }
                        });
                    }
                }
            });
        }

        this.COL_SETTINGSS[5].children = childrenList;
    }
    private setColumnsChildrens(): void {
        const codeCounts: string[] = [];
        const childrenList = [] as any;

        const testArr = [] as any;
        this.model.lists.forEach((it) => {
            const listCodes = it.item.code_counts;
            const codeJson = typeof listCodes === 'string' ? JSON.parse(listCodes) : listCodes;
            for (const key in codeJson) {
                if (key) {
                    testArr.push(key);
                }
            }
        });
        if (testArr.length > 0) {
            this.model.lists.forEach((list) => {
                const listCodes = list.item.code_counts;
                const codeJson = typeof listCodes === 'string' ? JSON.parse(listCodes) : listCodes;
                for (const key in codeJson) {
                    if (codeJson.hasOwnProperty(key)) {
                        const hasKey = childrenList.find((info) => info.key === key);
                        !hasKey && childrenList.push({
                            key: key,
                            title: key,
                            dataIndex: 'code_counts',
                            render: (text, record, index) => {
                                const recordCodes = record.item.code_counts;
                                const recordJson = typeof recordCodes === 'string' ?
                                    JSON.parse(recordCodes) : recordCodes;
                                if (recordJson[key]) {
                                    let num = (recordJson[key]).toString();
                                    let result = '';
                                    while (num.length > 3) {
                                        result = ',' + num.slice(-3) + result;
                                        num = num.slice(0, num.length - 3);
                                    }
                                    if (num) { result = num + result; }
                                    return result;
                                }
                                // return recordJson[key];
                            }
                        });
                    }
                }
            });
        } else {
            this.model.lists.forEach((list) => {
                const codeJson = {'': ''};
                for (const key in codeJson) {
                    if (codeJson.hasOwnProperty(key)) {
                        const hasKey = childrenList.find((info) => info.key === key);
                        !hasKey && childrenList.push({
                            key: key,
                            title: key,
                            dataIndex: 'code_counts',
                            render: (text, record, index) => {
                                const recordCodes = record.item.code_counts;
                                const recordJson = typeof recordCodes === 'string' ?
                                    JSON.parse(recordCodes) : recordCodes;
                                return recordJson[key];
                            }
                        });
                    }
                }
            });
        }
        this.COL_SETTINGSS[6].title = (
            <span>
                响应业务码{
                this.model.modelConfigScene.moreConfig.businessNum ? (
                    '(' + this.model.modelConfigScene.moreConfig.businessNum + ')'
                ) : null
            }
            </span>
        ) as any;
        this.COL_SETTINGSS[6].children = childrenList;
    }

    public render(): React.ReactNode {
        this.setColumnsChildren();
        this.setColumnsChildrens();
        return (
            <div className={ style.sceneTask }>
                <div className={ style.pressureBox }>
                    <div className={ style.scene }>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to="/new.html/ultron/interfaceTest">
                                    <Icon type="usb"/>
                                    接口级压测
                                </Link>
                            </Breadcrumb.Item>
                            { /*<Breadcrumb.Item>*/ }
                                { /*{ this.model.modelConfigScene.valType }*/ }
                            { /*</Breadcrumb.Item>*/ }
                            <Breadcrumb.Item>{ this.model.modelConfigScene.planName }</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className={ style.pressureButton }>
                        {
                            this.buttonRender()
                        }
                    </div>
                </div>
                <div className={ style.sceneContent }>
                    <Tabs type="line">
                        <TabPane tab="压测脚本" key="1">
                            <div style={ { height: '220px' } }>
                                <pre>
                                    { this.model.modelConfigScene.pressureScript }
                                </pre>
                            </div>
                        </TabPane>
                        <TabPane tab="更多配置" key="2">
                            <div style={ { minHeight: '220px' } }>
                                <div className={ style.task }>超时时间：
                                    <span>{ this.model.modelConfigScene.moreConfig.timeoutSecond }</span>毫秒
                                </div>
                                <div className={ style.task }>
                                    <Checkbox
                                        defaultChecked={ this.model.modelConfigScene.moreConfig.isKeepLongLink }
                                        disabled={ true }
                                    />&nbsp;保持长连接
                                </div>
                                <div className={ style.task }>
                                    <Checkbox
                                        defaultChecked={ this.model.modelConfigScene.moreConfig.isAllowRedirect }
                                        disabled={ true }
                                    />
                                    &nbsp;允许重定向，最多
                                    <span>
                                        { this.model.modelConfigScene.moreConfig.maxRedirect }
                                    </span>次
                                </div>
                                <div  className={ style.task }>
                                    <Checkbox
                                        defaultChecked={ this.model.modelConfigScene.moreConfig.isBusinessNum }
                                        disabled={ true }
                                    />
                                    &nbsp;业务码统计&nbsp;
                                    {
                                        this.model.modelConfigScene.moreConfig.isBusinessNum === true ? (
                                            <Input
                                                defaultValue={
                                                    this.model.modelConfigScene.moreConfig.businessNum
                                                }
                                                style={ { width: '200px'} }
                                                disabled={ true }
                                            />
                                        ) : null
                                    }
                                </div>
                                <div>
                                    <Checkbox
                                        defaultChecked={ this.model.modelConfigScene.moreConfig.ifNeed }
                                        disabled={ true }
                                    />
                                    &nbsp;是否使用参数服务
                                </div>
                                <div>
                                    {
                                        this.model.modelConfigScene.moreConfig.ifNeed === true ? (
                                            <div style={ { marginTop: '10px'} }>
                                                <div>
                                                    <RadioGroup
                                                        value={ this.model.modelConfigScene.moreConfig.fileType }
                                                        disabled={ true }
                                                    >
                                                        <Radio value={ '1' }>默认服务</Radio>
                                                        <Radio value={ '0' }>自定义服务</Radio>
                                                    </RadioGroup>
                                                    {
                                                        this.model.modelConfigScene.moreConfig.fileType === '0' ? (
                                                            <Input
                                                                defaultValue={
                                                                    this.model.modelConfigScene.moreConfig.ip
                                                                }
                                                                style={ { width: '19.5%' } }
                                                                disabled={ true }
                                                            />
                                                        ) : null
                                                    }
                                                    {
                                                        this.model.modelConfigScene.moreConfig.ip !== '' &&
                                                        this.model.modelConfigScene.moreConfig.path !== ''
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
                        <TabPane tab="文件列表" key="3">
                            <div style={ { minHeight: '220px'} }>
                                {
                                    this.model.modelConfigScene.getList &&
                                    this.model.modelConfigScene.getList.map((item, index) => {
                                        return (
                                            <div
                                                key={ index }
                                                style={ { marginTop: '15px'} }
                                            >
                                                文件：
                                                <Input
                                                    defaultValue={ item }
                                                    style={ { width: '300px'} }
                                                    disabled={ true }
                                                />
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
                <div className={ style.pressureRecord }>
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
                <div className={ style.table }>
                    <Table
                        columns={ this.COL_SETTINGSS }
                        bordered={ true }
                        dataSource={ this.model.lists }
                        pagination={ false }
                        title={ this.titleTaskLists }
                    />
                </div>
            </div>
        );
    }
}
