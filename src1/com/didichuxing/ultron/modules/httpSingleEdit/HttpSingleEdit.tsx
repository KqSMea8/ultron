import React from 'react';
import ReactDOM from 'react-dom';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom';
import OdinTree from '@ultron/components/odinTree/OdinTree';
import ModalFileContent from '@ultron/modules/httpSingleEdit/modalFileContent/ModalFileContent';

import Modal from '@antd/modal';
import Table from '@antd/table';
import Button from '@antd/button';
import Input from '@antd/input';
import Tabs from '@antd/tabs';
import Select from '@antd/select';
import Radio from '@antd/radio';
import InputNumber from '@antd/input-number';
import Checkbox from '@antd/checkbox';
import Breadcrumb from '@antd/breadcrumb';
import Icon from '@antd/icon';
import message from '@antd/message';

import style from './HttpSingleEdit.less';

import ModelNameValue from '@ultron/components/modelNameValue/models/ModelNameValue';
import NameValueList from '@ultron/components/modelNameValue/views/ViewNameValueList';
import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';
import { AModule } from 'com/didichuxing/commonInterface/AModule';
import { Bind } from 'lodash-decorators';
import { observer } from 'mobx-react';
import ModelHttpSingleConfig from '@ultron/modules/httpSingleEdit/MHttpSingleEdit';
import { getGroups } from '@ultron/remote/common';
import { uploadCsv } from '@ultron/remote/testConfig';
import { IFile } from 'com/didichuxing/commonInterface/IWeb';
import { bind } from 'lodash-decorators/utils';
import { getCookie } from '@ultron/business/common/http/cookies';
import { computed } from 'mobx';

const InputGroup = Input.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const confirm = Modal.confirm;

const ObsInputUrl = bindObserver(Input, 'url', 'value');
const ObsBodyContent = bindObserver(Input.TextArea, 'bodyContent', 'value');
const ObsInputTimeoutSecond = bindObserver(InputNumber, 'timeoutSecond', 'value');
const ObsIsKeepLongLink = bindObserver(Checkbox, 'isKeepLongLink', 'checked');
const ObsIsAllowRedirect = bindObserver(Checkbox, 'isAllowRedirect', 'checked');
const ObsIsBusinessNum = bindObserver(Checkbox, 'isBusinessNum', 'checked');
const ObsBusinessNum = bindObserver(Input, 'businessNum', 'value');
const ObsMaxRedirect = bindObserver(InputNumber, 'maxRedirect', 'value');
// const ObsIsHasCustomized = bindObserver(Checkbox, 'isHasCustomizedIndexErrno', 'checked');
const ObsInputPlanName = bindObserver(Input, 'planName', 'value');
const ObsSelectMethod = bindObserver(Select, 'method', 'value');
const ObsSelectGroups = bindObserver(Select, 'groups', 'value');
const ObsRadioGroupBodyType = bindObserver(RadioGroup, 'bodyType', 'value');
const ObsInputFileName = bindObserver(Input, 'fileName', 'value');
const ObsInputDiSFValue = bindObserver(Input, 'DiSFValue', 'value');
const ObsSelectColonyMethod = bindObserver(Select, 'colonyMethod', 'value');
const ObsSelectOdinMethod = bindObserver(Select, 'odinMethod', 'value');
const ObsInputColony = bindObserver(Input, 'colonyValue', 'value');
const ObsInputOdin = bindObserver(Input, 'odinValue', 'value');
const ObsInputOdinPort = bindObserver(Input, 'odinPortValue', 'value');
const ObsRadioGroupSetting = bindObserver(RadioGroup, 'settingType', 'value');
const ObsIfNeed = bindObserver(Checkbox, 'ifNeed', 'checked');
const ObsFileRadio = bindObserver(RadioGroup, 'fileType', 'value');
const ObsIpInput = bindObserver(Input, 'ip', 'value');
const ObsPathInput = bindObserver(Input, 'path', 'value');

const COMMENT = `使用说明：
    1.选择请求方法。目前⽀持GET、POST、PUT、DELETE。
    2.输⼊请求URL。URL需要以http://或者https://开头；例如：http://www.baidu.com/。
    3.输⼊Body(仅针对POST和PUT请求)、Headers、Cookies。
    4.在“更多配置”选项中配置请求超时时间、是否保持⻓连接、重定向次数、上传⾃定义变量csv文件等信息。
    5.自定义变量csv文件说明：
        例: http://www.test.com/getPerson?key1=\${name}&key2=\${age}
        1)在URL和Body中，可以使⽤\${变量名称}的⽅式占位。
        2)csv⽂件格式：csv文件可以有n（n>=1）行m（m>=1）列。
        第1行是变量名称，第[2,n]行是请求参数值；m列代表m个变量，譬如上述示例的列为name,age。
        压测期间会循环使用[2,n]行的请求参数值直到压测结束，示例对应的csv文件格式如下表：
        name,age
        Alice,10
        Bob,20
        Carol,30
        3)上传自定义变量csv文件目前大小只支持50M。
    6.压测流量标识：
        1)压测流量和生产流量需要隔离开来，约定使用hintCode进行区分，涉及到http/thrift/socket等多种协议。
        2)http协议中，hintCode约定放在didi-header-hint-code头字段中。hintCode & 0x01 != 0的时候为压测流量。
        3)未设置didi-header-hint-code头字段时，后端会自动加上该头，value为1。
`;
const DiSFCOMMENT = `使用说明：
    1.输入DiSF集群唯一标识。例如：hna.biz-gs-dds。
    2.选择请求方法。目前⽀持GET、POST、PUT、DELETE。
    3.输⼊请求URL。例如：/test?a=1。
    4.输⼊Body(仅针对POST和PUT请求)、Headers、Cookies。
    5.在“更多配置”选项中配置请求超时时间、是否保持⻓连接、重定向次数、上传⾃定义变量csv文件等信息。
    6.自定义变量csv文件说明：
        例: http://www.test.com/getPerson?key1=\${name}&key2=\${age}
        1)在URL和Body中，可以使⽤\${变量名称}的⽅式占位。
        2)csv⽂件格式：csv文件可以有n（n>=1）行m（m>=1）列。
        第1行是变量名称，第[2,n]行是请求参数值；m列代表m个变量，譬如上述示例的列为name,age。
        压测期间会循环使用[2,n]行的请求参数值直到压测结束，示例对应的csv文件格式如下表：
        name,age
        Alice,10
        Bob,20
        Carol,30
        3)上传自定义变量csv文件目前大小只支持50M。
    7.压测流量标识：
        1)压测流量和生产流量需要隔离开来，约定使用hintCode进行区分，涉及到http/thrift/socket等多种协议。
        2)http协议中，hintCode约定放在didi-header-hint-code头字段中。hintCode & 0x01 != 0的时候为压测流量。
        3)未设置didi-header-hint-code头字段时，后端会自动加上该头，value为1。
`;
// class InputForFile extends Input {
//
//     constructor(p, c) {
//         super(p, c);
//         this.shouldComponentUpdate = null;
//         console.log(this);
//     }
// }

// function InputForFile(props) {
//     return <input { ...props } />;
// }
const url = 'http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=170734641';
@observer
export default class HttpSingleConfig extends AModule<ModelHttpSingleConfig> {

    private refFile: any = null;
    private refFiles: any = null;

    constructor(p, c) {
        super(p, c);
    }

    private async saveToServer(): Promise<boolean> {
        const results = await this.model.modelTestConfigSH.isCanSave2();
        if (results.isPass) {
            const result = await this.model.modelTestConfigSH.save();
            if (result.isPass) {
                message.success('保存成功');
                const query = {
                    planId: this.model.modelTestConfigSH.planId,
                    planName: this.model.modelTestConfigSH.planName
                };
                this.replace({ url: '/ultron/interfaceTest/httpSingleDetail', query });
                return Promise.resolve(true);
            } else {
                message.error('保存失败：' + result.text);
                return Promise.reject(true);
                // message.error('保存失败：' + result.text);
            }
        } else {
            message.error('请检查：，' + results.text);
            return Promise.reject(true);
        }
    }

    @Bind()
    private async onClickSave(): Promise<void> {
        const result = await this.model.modelTestConfigSH.isCanSave1();
        if (!result.isPass) {
            message.error('请检查：' + result.text);
            return Promise.resolve();
        }
        const groups = await getGroups({ type: '1' });
        confirm({
            title: '请填写名称和选择分组',
            content: (
                <div>
                    <div>名称：
                        <ObsInputPlanName
                            placeholder="压测计划名称(例：乘客发单)"
                            style={ { width: '80%' } }
                            model={ this.model.modelTestConfigSH }
                            onChange={ this.setPlanName }
                        />
                    </div>
                    <div>分组：
                        <ObsSelectGroups
                            disabled={ this.model.modelTestConfigSH.vIsDisabledWhenEdit }
                            style={ { width: '80%' } }
                            model={ this.model.modelTestConfigSH }
                            onChange={ this.setGroups }
                        >
                            {
                                groups.map(
                                    (it) => (
                                        <Option key={ it.value } value={ it.value }>
                                            { it.name + (it.value === '15' ? '(通用不需要授权)' : '(需要授权)') }
                                        </Option>
                                    )
                                )
                            }
                        </ObsSelectGroups>
                    </div>
                </div>
            ),
            onOk: () => {
                return this.saveToServer();
            }
        });

    }

    @Bind()
    private onClickCancel() {
        const query = {
            planId: this.model.modelTestConfigSH.planId,
            planName: this.model.modelTestConfigSH.planName
        };
        if (this.model.modelTestConfigSH.planId) {
            this.replace({ url: '/ultron/interfaceTest/httpSingleDetail', query });
        } else {
            this.replace({ url: '/ultron/interfaceTest'});
        }
    }

    protected createModel(): ModelHttpSingleConfig {
        return new ModelHttpSingleConfig(this.query);
    }

    @Bind()
    private setUrl(evt): void {
        this.model.modelTestConfigSH.setUrl(evt.target.value);
    }

    @Bind()
    private setColonyValue(evt): void {
        this.model.modelTestConfigSH.setColonyValue(evt.target.value);
    }

    @Bind()
    private setBodyContent(evt): void {
        this.model.modelTestConfigSH.setBodyContent(evt.target.value);
    }

    @Bind()
    private setTimeoutSecond(evt): void {
        this.model.modelTestConfigSH.setTimeoutSecond(evt);
    }

    @Bind()
    private setIsKeepLongLink(evt): void {
        this.model.modelTestConfigSH.setIsKeepLongLink(evt.target.checked);
    }

    @Bind()
    private setIsAllowRedirect(evt): void {
        this.model.modelTestConfigSH.setIsAllowRedirect(evt.target.checked);
    }

    @Bind()
    private setMaxRedirect(evt): void {
        this.model.modelTestConfigSH.setMaxRedirect(evt);
    }

    @Bind()
    private setIsHasCustomized(evt): void {
        this.model.modelTestConfigSH.setIsHasCustomized(evt.target.checked);
    }

    @Bind()
    private setPlanName(evt): void {
        this.model.modelTestConfigSH.setPlanName(evt.target.value);
    }

    @Bind()
    private onChangeBodyType(evt): void {
        this.model.modelTestConfigSH.setBodyType(evt.target.value);
        if (evt.target.value === 'file') {
            const dom: any = ReactDOM.findDOMNode(this.refFiles);
            dom.value = '';
            dom.click();
        }
    }

    @Bind()
    private setMethod(val): void {
        this.model.modelTestConfigSH.setMethod(val);
        if (this.model.modelTestConfigSH.isBodyDisabled) {
            this.model.setTabKey('1');
        }
    }

    @Bind()
    private setColonyMethod(val): void {
        this.model.modelTestConfigSH.setColonyMethod(val);
    }

    @Bind()
    private setOdinMethod(val): void {
        this.model.modelTestConfigSH.setOdinMethod(val);
    }

    @Bind()
    private setGroups(val): void {
        this.model.modelTestConfigSH.setGroups(val);
    }

    @Bind()
    private onClickFile(evt): void {
        const dom: any = ReactDOM.findDOMNode(this.refFile);
        dom.value = '';
        dom.click();
    }

    @Bind()
    private onChangeSetting(e) {
        this.model.modelTestConfigSH.changeSettingType(e.target.value);
    }
    @Bind()
    private onChangeDiSF(e) {
        this.model.modelTestConfigSH.changeDiSFValue(e.target.value);
    }

    @Bind()
    private onDblClick(e) {
        this.model.modelTestConfigSH.isOdinTree = true;
        e.stopPropagation();
    }

    @Bind()
    private click(e) {
        e.stopPropagation();
    }

    @Bind()
    private divClick() {
        this.model.modelTestConfigSH.isOdinTree = false;
    }

    @Bind()
    private getSelectValue(val) {
        if (val !== '') {
            this.model.modelTestConfigSH.isOdinTree = false;
        }
        this.model.modelTestConfigSH.setOdinValue(val);
    }

    @Bind()
    private setOdinPort(evt): void {
        this.model.modelTestConfigSH.setOdinPort(evt.target.value);
    }

    @Bind()
    private setIfNeed(evt): void {
        this.model.modelTestConfigSH.setIfNeed(evt.target.checked);
    }

    @Bind()
    private setFileType(evt): void {
        this.model.modelTestConfigSH.setFileType(evt.target.value);
    }
    @Bind()
    private setIp(evt): void {
        this.model.modelTestConfigSH.setIp(evt.target.value);
    }
    @Bind()
    private setPath(evt): void {
        this.model.modelTestConfigSH.setPath(evt.target.value);
    }
    @Bind()
    private iconOver(): void {
        this.model.modelTestConfigSH.isShow = true;
    }
    @Bind()
    private iconLeave(): void {
        this.model.modelTestConfigSH.isShow = false;
    }
    @Bind()
    public search(e): void {
        if (e.keyCode === 13) {
            if (this.model.modelTestConfigSH.moreConfig.numberInput === '') {
                message.error('起始行不能为空');
            } else {
                this.model.modelTestConfigSH.numberInput();
            }
        }
    }
    @Bind()
    private see(): void {
        this.model.modelTestConfigSH.moreConfig.numberInput = '';
        // this.model.modelTestConfigSH.moreConfig.fileContentArr = [];
        this.model.modelTestConfigSH.getNumberInput();
        Modal.info({
            title: '请输入要查看的行号',
            width: 800,
            okText: '取消',
            content: (
                <ModalFileContent model={ this.model }/>
            )
        });
    }

    private renderSetting() {
        const settingType = this.model.modelTestConfigSH.settingType;
        if (settingType === '3') {
            return (
                <div className={ style.settingBox }>
                    DiSF:
                    <ObsInputDiSFValue
                        model={ this.model.modelTestConfigSH }
                        style={ {width: '90%'} }
                        onChange={ this.onChangeDiSF }
                        placeholder="请输入集群唯一标识，例： hna.biz-gs-dds"
                        disabled={ this.model.modelTestConfigSH.vIsDisabledWhenEdit }
                    />
                    {
                        this.model.modelTestConfigSH.DiSFValue.length > 0
                            ? (
                            <span
                                className={ style.endpoints }
                                onClick={ this.getEndpointslist }
                            >
                                查看Endpoints
                            </span>
                        ) : null
                    }
                </div>
            );
        } else if (settingType === '2') {
            return (
                <div className={ style.colony }>
                    <InputGroup compact={ true }>
                        <ObsSelectColonyMethod
                            disabled={ this.model.modelTestConfigSH.vIsDisabledWhenEdit }
                            model={ this.model.modelTestConfigSH }
                            style={ { width: '10%' } }
                            onChange={ this.setColonyMethod }
                        >
                            <Option value="http">HTTP</Option>
                            <Option value="https">HTTPS</Option>
                        </ObsSelectColonyMethod>
                        <ObsInputColony
                            disabled={ this.model.modelTestConfigSH.vIsDisabledWhenEdit }
                            model={ this.model.modelTestConfigSH }
                            style={ { width: '90%' } }
                            placeholder="服务地址($ip:$port*$weight)，例：192.168.0.1：8080*50"
                            onChange={ this.setColonyValue }
                            onPressEnter={ null }
                        />
                    </InputGroup>
                </div>
            );
        } else if (settingType === '4') {
            return (
                <div className={ style.odin }>
                    <InputGroup compact={ true }>
                        <ObsSelectOdinMethod
                            disabled={ this.model.modelTestConfigSH.vIsDisabledWhenEdit }
                            model={ this.model.modelTestConfigSH }
                            style={ { width: '10%' } }
                            onChange={ this.setOdinMethod }
                        >
                            <Option value="http">HTTP</Option>
                            <Option value="https">HTTPS</Option>
                        </ObsSelectOdinMethod>
                        <ObsInputOdin
                            style={ { width: '30%' } }
                            onDoubleClick={ this.onDblClick }
                            model={ this.model.modelTestConfigSH }
                            placeholder="Odin集群节点，例：hna.biz-driver.gs.biz.didi.com"
                        />
                        <ObsInputOdinPort
                            model={ this.model.modelTestConfigSH }
                            onChange={ this.setOdinPort }
                            style={ { width: '6%'} }
                            placeholder="端口号"
                        />
                    </InputGroup>
                    <div className={ style.odinTree }>
                        {
                            this.model.modelTestConfigSH.isOdinTree ? (
                                <div onClick={ this.click }>
                                    <OdinTree getSelectValues={ this.getSelectValue }/>
                                </div>
                            ) : null
                        }
                    </div>
                </div>
            );
        }
    }
    @Bind()
    private async getEndpointslist() {
        await this.model.modelTestConfigSH.getEndpointslist();
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
        const dataSource = this.model.modelTestConfigSH.endpointsList;
        const inst = Modal.info({
            title: 'Endpoints列表',
            width: '60%',
            content: (
                <div>
                    <p className={ style.disfTitle }>DiSF: { this.model.modelTestConfigSH.DiSFValue }</p>
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
    private async onChangeFile(evt): Promise<void> {
        const files: IFile[] = evt.target.files;
        if (files.length < 1) {
            this.model.modelTestConfigSH.moreConfig.setFileName('');
            this.model.modelTestConfigSH.isSeeButton = false;
            return;
        }
        const file = files[0];
        if (file.size < 1) {
            Modal.error({
                title: '文件有误',
                content: '文件内容不能为空'
            });
            this.model.modelTestConfigSH.moreConfig.setFileName('');
            this.model.modelTestConfigSH.isSeeButton = false;
            return;
        }
        if (file.size > 50 * 1024 * 1024) {
            Modal.error({
                title: '文件过大',
                content: (
                    <div>
                        文件大小不能超过50M，解决方案请查看<a href={ url } target="_blank">文件使用手册</a>
                    </div>
                )
            });
            this.model.modelTestConfigSH.moreConfig.setFileName('');
            this.model.modelTestConfigSH.isSeeButton = false;
            return;
        }
        const hide = message.loading('文件上传中, 请稍后...', 0);
        const fileName = file.name;
        const createUser = getCookie().username || 'hanweiqi';
        const data = new FormData();
        data.append('file', file as any);
        data.append('createUser', createUser as any);
        try {
            this.model.modelTestConfigSH.moreConfig.uploadPath = await uploadCsv(data);
            if (this.model.modelTestConfigSH.moreConfig.uploadPath &&
                this.model.modelTestConfigSH.moreConfig.uploadPath !== '') {
                this.model.modelTestConfigSH.moreConfig.setFileName(fileName);
                this.model.modelTestConfigSH.isSeeButton = true;
            } else {
                this.model.modelTestConfigSH.moreConfig.setFileName('');
                this.model.modelTestConfigSH.isSeeButton = false;
            }
        } finally { hide(); }
    }
    @Bind()
    private async onChangeFiles(evt): Promise<void> {
        const files: IFile[] = evt.target.files;
        if (files.length < 1) {
            this.model.modelTestConfigSH.setFileNames('');
            return;
        }
        const file = files[0];
        if (file.size < 1) {
            Modal.error({
                title: '文件有误',
                content: '文件内容不能为空'
            });
            this.model.modelTestConfigSH.setFileNames('');
            return;
        }
        if (file.size > 50 * 1024 * 1024) {
            Modal.error({
                title: '文件过大',
                content: (
                    <div>
                        文件大小不能超过50M，解决方案请查看<a href={ url } target="_blank">文件使用手册</a>
                    </div>
                )
            });
            this.model.modelTestConfigSH.setFileNames('');
            return;
        }
        const hide = message.loading('文件上传中, 请稍后...', 0);
        const fileName = file.name;
        const createUser = getCookie().username || 'hanweiqi';
        const data = new FormData();
        data.append('file', file as any);
        data.append('createUser', createUser as any);
        try {
            this.model.modelTestConfigSH.moreConfig.uploadPath = await uploadCsv(data);
            this.model.modelTestConfigSH.setFileNames(fileName);
        } finally {
            hide();
        }
    }

    @Bind()
    private setRefFile(ref) { this.refFile = ref; }
    @Bind()
    private setRefFiles(ref) { this.refFiles = ref; }

    @Bind()
    private setIsBusinessNum(evt): void {
        this.model.modelTestConfigSH.setIsBusinessNum(evt.target.checked);
    }
    @Bind()
    private setBusinessNum(evt): void {
        this.model.modelTestConfigSH.setBusinessNum(evt.target.value);
    }

    private fileRender(): React.ReactNode {
        const fileType = this.model.modelTestConfigSH.moreConfig.fileType;
        if (fileType === '0') {
            return (
                <div>
                    <div>
                        <span>文件路径</span>
                        <ObsPathInput
                            model={ this.model.modelTestConfigSH.moreConfig }
                            onChange={ this.setPath }
                            style={ { width: '370px', marginLeft: '10px', marginBottom: '15px' } }
                            placeholder="/home/xiaoju/data/test.csv"
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className={ style.config }>
                        自定义变量&nbsp;
                        <ObsInputFileName
                            className={ style.fileNameInput }
                            model={ this.model.modelTestConfigSH.moreConfig }
                            disabled={ true }
                        />
                        <Button type="primary" onClick={ this.onClickFile }>选择文件</Button>
                        {
                            this.model.modelTestConfigSH.isSeeButton &&
                            this.model.modelTestConfigSH.moreConfig.uploadPath !== '' &&
                            this.model.modelTestConfigSH.moreConfig.uploadPath ? (
                                <Button
                                    style={ { marginLeft: '15px'} }
                                    onClick={ this.see }
                                >
                                    查看文件
                                </Button>
                            ) : null
                        }
                        <Input
                            ref={ this.setRefFile }
                            type="file"
                            className={ style.fileInput }
                            onChange={ this.onChangeFile }
                        />
                    </div>
                </div>
            );
        }
    }

    public render(): React.ReactNode {
        return (
            <div className={ style.httpSingle } onClick={ this.divClick }>
                <div className={ style.saveBox }>
                    <div className={ style.newlyBuild }>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to="/new.html/ultron/interfaceTest">
                                    <Icon type="usb"/>
                                    接口级压测
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                { this.model.modelTestConfigSH.planName || '新建' }
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className={ style.saveButton }>
                        <Button type="danger" onClick={ this.onClickCancel }>取消</Button>
                        &nbsp;
                        <Button type="primary" onClick={ this.onClickSave }>保存</Button>
                    </div>
                </div>
                <div className={ style.settingType }>
                    <ObsRadioGroupSetting
                        model={ this.model.modelTestConfigSH }
                        onChange={ this.onChangeSetting }
                        value={ String(this.model.modelTestConfigSH.settingType) }
                        disabled={ this.model.modelTestConfigSH.vIsDisabledWhenEdit }
                    >
                        <Radio value={ '1' }>默认</Radio>
                        { /*<Radio value={ '2' }>集群</Radio>*/ }
                        <Radio value={ '3' }>DiSF</Radio>
                        { /*<Radio value={ '4' }>Odin</Radio>*/ }
                    </ObsRadioGroupSetting>
                    { this.renderSetting() }
                </div>
                <div className={ style.method }>
                    <InputGroup compact={ true }>
                        <ObsSelectMethod
                            disabled={ this.model.modelTestConfigSH.vIsDisabledWhenEdit }
                            model={ this.model.modelTestConfigSH }
                            style={ { width: '10%' } }
                            onChange={ this.setMethod }
                        >
                            <Option value="GET">GET</Option>
                            <Option value="POST">POST</Option>
                            <Option value="PUT">PUT</Option>
                            <Option value="DELETE">DELETE</Option>
                        </ObsSelectMethod>
                        <ObsInputUrl
                            disabled={ this.model.modelTestConfigSH.vIsDisabledWhenEdit }
                            model={ this.model.modelTestConfigSH }
                            style={ { width: '90%' } }
                            placeholder={ this.model.modelTestConfigSH.placeHolder }
                            onChange={ this.setUrl }
                            onPressEnter={ null }
                        />
                    </InputGroup>
                </div>
                <div className={ style.httpContent }>
                    <Tabs type="line" activeKey={ this.model.tabKey } onChange={ this.model.setTabKey }>
                        <TabPane tab="Headers" key="1">
                            <div className={ style.headerNameValue }>
                                <NameValueList model={ this.model.modelTestConfigSH.headers }/>
                                { /*<ObsNameValueListHeaders model={ this.model.modelTestConfigSH }/>*/ }
                            </div>
                        </TabPane>
                        <TabPane tab="Body" key="2" disabled={ this.model.modelTestConfigSH.isBodyDisabled }>
                            <div style={ { height: '220px' } } className={ style.bodyTab }>
                                <ObsRadioGroupBodyType
                                    name="radiogroup"
                                    model={ this.model.modelTestConfigSH }
                                    className={ style.bodyTabBox }
                                    onChange={ this.onChangeBodyType }
                                >
                                    <Radio value="urlencoded">x-www-form-urlencoded</Radio>
                                    <Radio value="json">json</Radio>
                                    <Radio value="text">text</Radio>
                                    { /*<Radio value="file">文件上传</Radio>*/}
                                </ObsRadioGroupBodyType>
                                <Input
                                    ref={ this.setRefFiles }
                                    type="file"
                                    className={ style.fileInputs }
                                    onChange={ this.onChangeFiles }
                                />
                                <div>
                                    <ObsBodyContent
                                        rows={ 7 }
                                        disabled={ this.model.modelTestConfigSH.isBodyDisabled }
                                        model={ this.model.modelTestConfigSH }
                                        onChange={ this.setBodyContent }
                                        placeholder={ this.model.modelTestConfigSH.bodyPlaceholder }
                                    />
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="Cookies" key="3">
                            <div className={ style.cookieNameValue }>
                                <NameValueList model={ this.model.modelTestConfigSH.cookies }/>
                            </div>
                        </TabPane>
                        <TabPane tab="更多配置" key="4">
                            <div style={ { minHeight: '220px' } } className={ style.configBox }>
                                <div className={ style.config }>超时时间&nbsp;:&nbsp;<ObsInputTimeoutSecond
                                    min={ 1 }
                                    max={ 12000 }
                                    defaultValue={ 10000 }
                                    model={ this.model.modelTestConfigSH.moreConfig }
                                    onChange={ this.setTimeoutSecond }
                                />&nbsp;毫秒<span style={ { color: '#ccc' } }>（取值范围为1-12000毫秒）</span></div>
                                <div className={ style.config }>
                                    <ObsIsKeepLongLink
                                        model={ this.model.modelTestConfigSH.moreConfig }
                                        onChange={ this.setIsKeepLongLink }
                                    >保持长连接
                                    </ObsIsKeepLongLink>
                                </div>
                                <div className={ style.config }>
                                    <ObsIsAllowRedirect
                                        model={ this.model.modelTestConfigSH.moreConfig }
                                        onChange={ this.setIsAllowRedirect }
                                    >
                                        允许重定向
                                    </ObsIsAllowRedirect>
                                    <span
                                        className={
                                            this.model.modelTestConfigSH.moreConfig.maxRedirect < 1 ?
                                                style.spanMaxRedirectNone :
                                                style.spanMaxRedirect
                                        }
                                    >
                                        ，最多
                                        <ObsMaxRedirect
                                            min={ 1 }
                                            max={ 10 }
                                            defaultValue={ 10 }
                                            model={ this.model.modelTestConfigSH.moreConfig }
                                            onChange={ this.setMaxRedirect }
                                        />&nbsp;次
                                    </span>
                                </div>
                                <div className={ style.config }>
                                    <ObsIsBusinessNum
                                        model={ this.model.modelTestConfigSH.moreConfig }
                                        onChange={ this.setIsBusinessNum }
                                    >
                                        业务码统计
                                    </ObsIsBusinessNum>
                                    {
                                        this.model.modelTestConfigSH.moreConfig.isBusinessNum === true ? (
                                            <ObsBusinessNum
                                                model={ this.model.modelTestConfigSH.moreConfig }
                                                onChange={ this.setBusinessNum }
                                                style={ { width: '200px'} }
                                            />
                                        ) : null
                                    }
                                </div>
                                <div>
                                    <ObsIfNeed
                                        model={ this.model.modelTestConfigSH.moreConfig }
                                        onChange={ this.setIfNeed }
                                    >
                                        是否使用参数服务
                                    </ObsIfNeed>
                                    <span
                                        onMouseOver={ this.iconOver }
                                        onMouseLeave={ this.iconLeave }
                                        className={ style.icon }
                                    >
                                        <Icon
                                            type="question-circle"
                                            style={ { color: '#1890ff' } }
                                        />
                                        {
                                            this.model.modelTestConfigSH.isShow === true ? (
                                                <div className={ style.hideShow }>
                                                    <p
                                                        style={ { marginTop: '10px'} }
                                                    >1.小于50M的文件可以使用默认服务，默认服务支持.csv，.tar.gz格式文件，具体文件要求参考
                                                        <a
                                                            href={ url }
                                                            target="_blank"
                                                        >
                                                            文件服务使用手册
                                                        </a>
                                                    </p>
                                                    <p>2.大于50M的文件可以使用自定义服务，即自己搭建文件数据源，具体搭建方式参考
                                                        <a
                                                            href={ url }
                                                            target="_blank"
                                                        >
                                                            文件服务使用手册
                                                        </a>
                                                    </p>
                                                </div>
                                            ) : null
                                        }
                                    </span>
                                </div>
                                {
                                    this.model.modelTestConfigSH.moreConfig.ifNeed === true ? (
                                        <div>
                                            <div>
                                                <ObsFileRadio
                                                    model={ this.model.modelTestConfigSH.moreConfig }
                                                    value={ this.model.modelTestConfigSH.moreConfig.fileType }
                                                    onChange={ this.setFileType }
                                                    style={ { marginTop: '10px'} }
                                                >
                                                    <Radio value={ '1' }>默认服务</Radio>
                                                    <Radio value={ '0' }>自定义服务</Radio>
                                                </ObsFileRadio>
                                                {
                                                    this.model.modelTestConfigSH.moreConfig.fileType === '0' ? (
                                                        <span>
                                                            <ObsIpInput
                                                                model={ this.model.modelTestConfigSH.moreConfig }
                                                                onChange={ this.setIp }
                                                                style={ { width: '230px' } }
                                                                placeholder="100.69.185.14:8095"
                                                            />
                                                            {
                                                                this.model.modelTestConfigSH.moreConfig.ip !== '' &&
                                                                    this.model.modelTestConfigSH.moreConfig.path !== ''
                                                                    ? (
                                                                    <Button
                                                                        style={ { marginLeft: '15px'} }
                                                                        onClick={ this.see }
                                                                    >
                                                                        查看文件
                                                                    </Button>
                                                                ) : null
                                                            }
                                                        </span>
                                                    ) : null
                                                }
                                            </div>
                                            <div style={ { marginTop: '10px'} }>
                                                { this.fileRender() }
                                            </div>
                                        </div>
                                    ) : null
                                }
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
                <div>
                    <pre className={ style.comment }>
                        { this.model.modelTestConfigSH.settingType === '1'
                            ? COMMENT
                            : DiSFCOMMENT
                        }
                    </pre>
                </div>
            </div>
        );
    }
}
