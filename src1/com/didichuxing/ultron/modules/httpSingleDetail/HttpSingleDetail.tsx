import React from 'react';
import Button from '@antd/button';
import Input from '@antd/input';
import Tabs from '@antd/tabs';
import Checkbox from '@antd/checkbox';
import Table from '@antd/table';
import style from './HttpSingleDetail.less';
import ModelHttpSingleTask, { ModelListItem } from '@ultron/modules/httpSingleDetail/MHttpSingleDetail';
import ModalFileContent from '@ultron/modules/httpSingleDetail/modalFileContent/ModalFileContent';
import { AModule } from 'com/didichuxing/commonInterface/AModule';
import { observer } from 'mobx-react';
import { Bind } from 'lodash-decorators';
import { showTestModes } from '@ultron/business/modelTestMode/views/ViewTestModes';
import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';
import { Link } from 'react-router-dom';
import Breadcrumb from '@antd/breadcrumb';
import Icon from '@antd/icon';
// import { showStatus } from 'com/didichuxing/ultron/remote/modalStatus';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/styles/hljs';
import Modal from '@antd/modal';
import Radio from '@antd/radio';
import message from '@antd/message';
import Card from '@antd/card';
import Select from '@antd/select';

const RadioGroup = Radio.Group;
const InputGroup = Input.Group;
const Option = Select.Option;

const TabPane = Tabs.TabPane;
const ObsRadioGroupSetting = bindObserver(RadioGroup, 'settingType', 'value');
const ObsApiSelect = bindObserver(Select, 'apiValue', 'value');
interface IViewJSONProps {
    value: string;
}

const ViewBody = ({ value }: IViewJSONProps) => {
    try {
        return (
            <SyntaxHighlighter language="json" style={ docco }>
                { JSON.stringify(JSON.parse(value), null, 2) }
            </SyntaxHighlighter>);
    } catch (e) {
        // console.log('JSON数据格式错误|或者根本不是JSON格式数据');
        return <pre style={ { overflow: 'auto' } }> { value } </pre>;
    }
};

interface IColumnsInfo {
    title: string;
    dataIndex: string;
    key: string;
    children?: IColumnsInfo[];
}

const storage = window.localStorage;
let isModalShow = true;

@observer
export default class HttpSingleTask extends AModule<ModelHttpSingleTask> {
    private inst?: any;
    private COL_SETTINGS = [
        {
            title: '压测ID', dataIndex: 'vTaskId', key: 'vTaskId', render: (text, record: ModelListItem) => {
            const onClick = () => {
                this.toTaskDetail(
                    this.model.planId,
                    String(record.item.taskId),
                    String(this.model.modelConfigHttpSingle.type),
                    this.model.modelConfigHttpSingle.planName,
                    this.model.modelConfigHttpSingle.moreConfig.businessNum
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
        { title: '机房', dataIndex: 'vRegion', key: 'vRegion' },
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
        {
            title: '压测ID', dataIndex: 'vTaskIds', key: 'vTaskIds', render: (text, record) => {
            const onClick = () => {
                this.toTaskDetail(
                    this.model.planId,
                    String(record.item.taskId),
                    String(this.model.modelConfigHttpSingle.type),
                    this.model.modelConfigHttpSingle.planName,
                    this.model.modelConfigHttpSingle.moreConfig.businessNum
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
        { title: '', children: [] }
    ];

    constructor(props, context) {
        super(props, context);
    }

    /**
     * 删除压测计划
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
        return (
            <span style={ { marginLeft: '16px' } }>压测记录</span>
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
                    <span style={ { marginLeft: '16px' } }>压测结果</span>
                </div>
                <div style={ { marginTop: '10px' } }>
                    <span style={ { marginLeft: '16px' } }>接口：</span>
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

    protected createModel(): ModelHttpSingleTask {
        return new ModelHttpSingleTask(this.query);
    }

    @Bind()
    private toTaskDetail(planId: string, taskId: string, type: string, planName: string, businessCode: string): any {
        this.push({ url: '/ultron/interfaceTest/taskDetail', query: { planId, taskId, type, planName, businessCode } });
    }

    @Bind()
    private async getEndpointslist() {
        await this.model.modelConfigHttpSingle.getEndpointslist();
        this.renderModal();
    }

    private renderModal() {
        const columns = [{
            title: 'protocol',
            dataIndex: 'protocol',
            key: 'protocol'
        }, {
            title: 'port',
            dataIndex: 'port',
            key: 'port'
        }, {
            title: 'ip',
            dataIndex: 'ip',
            key: 'ip'
        }, {
            title: 'status',
            dataIndex: 'status',
            key: 'status'
        }];
        const dataSource = this.model.modelConfigHttpSingle.endpointsList;
        const inst = Modal.info({
            title: 'Endpoints列表',
            width: '60%',
            content: (
                <div>
                    <p className={ style.disfTitle }>DiSF:{ this.model.modelConfigHttpSingle.DiSFValue }</p>
                    <Table
                        dataSource={ dataSource }
                        columns={ columns }
                        rowKey="endpointId"
                        pagination={ false }
                    />
                </div>
            )
        });
    }

    @Bind()
    private toConfigEdit(): any {
        const query = {
            planId: this.model.planId,
            planName: this.model.modelConfigHttpSingle.planName
        };
        this.push({ url: '/ultron/interfaceTest/httpSingle', query });
    }

    @Bind()
    private onPageChange(pageNo: number): any {
        this.model.toPage(pageNo);
        this.push();
    }

    public componentDidMount(): any {
        this.model.loadData();
        this.model.loadDataApi();
    }

    public fourMode() {
        if (Number(this.model.modelConfigHttpSingle.settingType) === 3) {
            return (
                <div className={ style.disf }>
                    DiSF:
                    <Input
                        style={ { width: '93%' } }
                        disabled={ true }
                        value={ this.model.modelConfigHttpSingle.DiSFValue }
                    />
                    <span
                        className={ style.endpoints }
                        onClick={ this.getEndpointslist }
                    >
                        查看Endpoints
                    </span>
                </div>
            );
        } else if (Number(this.model.modelConfigHttpSingle.settingType) === 2) {
            return (
                <div className={ style.colony }>
                    <InputGroup compact={ true }>
                        <Input
                            style={ { width: '7%' } }
                            value={ this.model.modelConfigHttpSingle.colonyMethod }
                            disabled={ true }
                        />
                        <Input
                            style={ { width: '93%' } }
                            disabled={ true }
                            value={ this.model.modelConfigHttpSingle.colonyValue }
                        />
                    </InputGroup>
                </div>
            );
        } else if (Number(this.model.modelConfigHttpSingle.settingType) === 4) {
            return (
                <div className={ style.odin }>
                    <InputGroup compact={ true }>
                        <Input
                            style={ { width: '7%' } }
                            value={ this.model.modelConfigHttpSingle.odinMethod }
                            disabled={ true }
                        />
                        <Input
                            style={ { width: '30%' } }
                            disabled={ true }
                            value={ this.model.modelConfigHttpSingle.odinValue }
                        />
                        <Input
                            style={ { width: '6%' } }
                            value={ this.model.modelConfigHttpSingle.odinPortValue }
                            disabled={ true }
                        />
                    </InputGroup>
                </div>
            );
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
            if (this.model.modelConfigHttpSingle.moreConfig.numberInput === '') {
                message.error('起始行不能为空');
            } else {
                this.model.modelConfigHttpSingle.numberInput();
            }
        }
    }

    @Bind()
    private see(): void {
        this.model.modelConfigHttpSingle.moreConfig.numberInput = '';
        // this.model.modelConfigHttpSingle.moreConfig.fileContentArr = [];
        this.model.modelConfigHttpSingle.getNumberInput();
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
        const fileType = this.model.modelConfigHttpSingle.moreConfig.fileType;
        if (fileType === '0') {
            return (
                <div>
                    <div style={ { marginTop: '10px' } }>
                        <span>文件路径</span>
                        <Input
                            defaultValue={ this.model.modelConfigHttpSingle.moreConfig.path }
                            style={ { width: '20%', marginLeft: '10px', marginBottom: '15px' } }
                            disabled={ true }
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div style={ { marginTop: '10px' } }>
                        自定义变量&nbsp;
                        <Input
                            defaultValue={ this.model.modelConfigHttpSingle.moreConfig.fileName }
                            style={ { width: '20%' } }
                            disabled={ true }
                        />
                        {
                            this.model.modelConfigHttpSingle.moreConfig.uploadPath !== ''
                            && this.model.modelConfigHttpSingle.moreConfig.uploadPath ? (
                                <Button
                                    style={ { marginLeft: '15px' } }
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
                                    if (num) {
                                        result = num + result;
                                    }
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
                const statusJson = { '': '' };
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
                                    if (num) {
                                        result = num + result;
                                    }
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
                const codeJson = { '': '' };
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
                this.model.modelConfigHttpSingle.moreConfig.businessNum ? (
                    '(' + this.model.modelConfigHttpSingle.moreConfig.businessNum + ')'
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
                            <Breadcrumb.Item>{ this.model.modelConfigHttpSingle.planName }</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className={ style.pressureButton }>
                        {
                            this.buttonRender()
                        }
                    </div>
                </div>
                { this.fourMode() }
                <div className={ style.methodUrl }>
                    <InputGroup compact={ true }>
                        <Input
                            style={ { width: '7%' } }
                            value={ this.model.modelConfigHttpSingle.method }
                            disabled={ true }
                        />
                        <Input
                            style={ { width: '93%' } }
                            disabled={ true }
                            value={ this.model.modelConfigHttpSingle.url }
                        />
                    </InputGroup>
                </div>
                <div className={ style.httpContent }>
                    <Tabs type="line">
                        <TabPane tab="Headers" key="1">
                            <div style={ { height: '220px' } }>
                                <pre>
                                    { this.model.modelConfigHttpSingle.vHeaders }
                                </pre>
                            </div>
                        </TabPane>
                        <TabPane tab="Body" key="2" disabled={ this.model.modelConfigHttpSingle.isBodyDisabled }>
                            <div style={ { height: '220px', overflow: 'auto' } }>
                                <div>
                                    <ViewBody value={ this.model.modelConfigHttpSingle.vBody }/>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="Cookies" key="3">
                            <div style={ { height: '220px' } }>
                                <pre>
                                    { this.model.modelConfigHttpSingle.vCookies }
                                </pre>
                            </div>
                        </TabPane>
                        <TabPane tab="更多配置" key="4">
                            <div style={ { minHeight: '220px' } }>
                                <div className={ style.task }>超时时间：
                                    <span>
                                        { this.model.modelConfigHttpSingle.moreConfig.timeoutSecond }
                                    </span>&nbsp;毫秒
                                </div>
                                <div className={ style.task }>
                                    <Checkbox
                                        defaultChecked={ this.model.modelConfigHttpSingle.moreConfig.isKeepLongLink }
                                        disabled={ true }
                                    />&nbsp;保持长连接
                                </div>
                                <div className={ style.task }>
                                    <Checkbox
                                        defaultChecked={ this.model.modelConfigHttpSingle.moreConfig.isAllowRedirect }
                                        disabled={ true }
                                    />
                                    &nbsp;允许重定向，最多
                                    <span>
                                        { this.model.modelConfigHttpSingle.moreConfig.maxRedirect }
                                    </span>次
                                </div>
                                <div className={ style.task }>
                                    <Checkbox
                                        defaultChecked={ this.model.modelConfigHttpSingle.moreConfig.isBusinessNum }
                                        disabled={ true }
                                    />
                                    &nbsp;业务码统计&nbsp;
                                    {
                                        this.model.modelConfigHttpSingle.moreConfig.isBusinessNum === true ? (
                                            <Input
                                                defaultValue={
                                                    this.model.modelConfigHttpSingle.moreConfig.businessNum
                                                }
                                                style={ { width: '200px' } }
                                                disabled={ true }
                                            />
                                        ) : null
                                    }
                                </div>
                                <div>
                                    <Checkbox
                                        defaultChecked={ this.model.modelConfigHttpSingle.moreConfig.ifNeed }
                                        disabled={ true }
                                    />
                                    &nbsp;是否使用参数服务
                                </div>
                                <div>
                                    {
                                        this.model.modelConfigHttpSingle.moreConfig.ifNeed === true ? (
                                            <div style={ { marginTop: '10px' } }>
                                                <div>
                                                    <RadioGroup
                                                        value={ this.model.modelConfigHttpSingle.moreConfig.fileType }
                                                        disabled={ true }
                                                    >
                                                        <Radio value={ '1' }>默认服务</Radio>
                                                        <Radio value={ '0' }>自定义服务</Radio>
                                                    </RadioGroup>
                                                    {
                                                        this.model.modelConfigHttpSingle.moreConfig.fileType === '0' ? (
                                                            <Input
                                                                defaultValue={
                                                                    this.model.modelConfigHttpSingle.moreConfig.ip
                                                                }
                                                                style={ { width: '19.5%' } }
                                                                disabled={ true }
                                                            />
                                                        ) : null
                                                    }
                                                    {
                                                        this.model.modelConfigHttpSingle.moreConfig.ip !== '' &&
                                                        this.model.modelConfigHttpSingle.moreConfig.path !== ''
                                                            ? (
                                                            <Button
                                                                style={ { marginLeft: '15px' } }
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
                <div style={ { marginTop: '10px' } }>
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
