import React from 'react';
import ReactDOM from 'react-dom';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom';

import Modal from '@antd/modal';
import Button from '@antd/button';
import Input from '@antd/input';
import Select from '@antd/select';
import Breadcrumb from '@antd/breadcrumb';
import Icon from '@antd/icon';
import message from '@antd/message';
import Card from '@antd/card';
import Tabs from '@antd/tabs';
import InputNumber from '@antd/input-number';
import Checkbox from '@antd/checkbox';
import Radio from '@antd/radio';

import style from './ThriftEdit.less';
import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';
import { AModule } from 'com/didichuxing/commonInterface/AModule';
import { Bind } from 'lodash-decorators';
import { observer } from 'mobx-react';
import ModelThriftConfig from '@ultron/modules/thriftEdit/MThriftEdit';
import { getGroups } from '@ultron/remote/common';
import { getThriftProtocoList, getThriftTypeList, uploadCsv, jarFile } from '@ultron/remote/testConfig';
import { observable, action, runInAction, computed } from 'mobx';
import NameTypeValueList from '@ultron/components/modelNameTypeValue/views/ViewNameTypeValueList';
import ModalFileContent from '@ultron/modules/thriftEdit/modalFileContent/ModalFileContent';
import { IFile } from 'com/didichuxing/commonInterface/IWeb';
import { getCookie } from '@ultron/business/common/http/cookies';

const InputGroup = Input.Group;
const Option = Select.Option;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;

const ObsInputIp = bindObserver(Input, 'ipList', 'value');
const ObsInputPort = bindObserver(Input, 'port', 'value');
const ObsInputServer = bindObserver(Input, 'service', 'value');
const ObsInputIdl = bindObserver(Input, 'idl', 'value');
const ObsInputMethod = bindObserver(Input, 'method', 'value');
const ObsInputPlanName = bindObserver(Input, 'planName', 'value');
const ObsSelectMethod = bindObserver(Select, 'protocolType', 'value');
const ObsSelectGroups = bindObserver(Select, 'groups', 'value');
const ObsInputTimeoutSecond = bindObserver(InputNumber, 'timeoutSecond', 'value');
const ObsInputFileName = bindObserver(Input, 'fileName', 'value');
const ObsIsAllowRedirect = bindObserver(Checkbox, 'ifMulti', 'checked');
const ObsInputServiceName = bindObserver(Input, 'serviceName', 'value');
const ObsIfNeed = bindObserver(Checkbox, 'ifNeed', 'checked');
const ObsFileRadio = bindObserver(RadioGroup, 'fileType', 'value');
const ObsIpInput = bindObserver(Input, 'ip', 'value');
const ObsPathInput = bindObserver(Input, 'path', 'value');
const ObsInputFileNames = bindObserver(Input, 'idlName', 'value');

const COMMENT = `一、使用说明：
    1.联系刘俊灵或潘旭东上传thrift的IDL文件，例如hello.thrift，上传完毕后会反馈一个IDL文件路径。
    2.选择传输协议，默认TBinaryProtocol。
    3.填写thrift服务器ip、port，多个ip以”,”分隔。
    4.填写IDL文件路径，根据管理员反馈的IDL文件路径填写。
    5.填写服务名称。
    6.填写方法名称。
    7.填写参数。
    8.更多配置
        1）指定超时时间，填写单位为毫秒，默认10000毫秒
        2）上传自定义参数csv文件
            i.基础数据类型，参数值可以使⽤\${变量名}的⽅式占位，值由自定义参数文件动态生成。
                例如：
                    参数名name、类型string、value填\${myName}
            ii.其他数据类型，参数值为json格式，可以使用\${变量名}占位代替整个json，也可以在json的字段中用\${变量名}占位。
                例如，下面两种都是有效的：
                    参数名employees、类型map、value填\${myEmployees}
                    参数名employees、类型map、value填{"name":"\${myName}","age":1000}
            iii.csv⽂件格式：csv文件可以有n（n>=1）行m（m>=1）列。
                第1行是变量名，第[2,n]行是请求参数值；m列代表m个变量，例如方法接收三个参数：
                    参数1，name、string类型、value填\${myname}
                    参数2，age、i32类型、value填\${myage}
                    参数3，info1、struct类型、value为{"address":"\${mystruct1}"}
                    参数3，info2、struct类型、value填\${mystruct2}压测期间会循环使用[2,n]行的请求参数值直到压测结束，示例对应的csv文件格式如下表：
                        myname,myage,mystruct1,mystruct2
                        Alice,10,didi,"{""sex"":""female"",""salary"":""1000""}"
                        Bob,20,didi,"{""sex"":""female"",""salary"":""1000""}"
                        Carol,30,didi,"{""sex"":""female"",""salary"":""1000""}"
            iiii.上传自定义参数csv文件目前大小只支持50M。
        3)是否指定远程服务名称
            如果服务端以多接口服务（TMultiplexedProtocol）的方式启动，则需指定一个远端服务名称。
二、数据类型说明（括号内为对应的Java类型）
    1.基础数据类型，value可直接填值；或用\${变量名}占位，值由自定义参数文件提供
        bool（boolean）    : 布尔类型              例：0或1
        byte（byte）       : 8位带符号整数          例：123
        i16（short）       : 16位带符号整数         例：123
        i32（int）         : 32位带符号整数         例：123
        i64（long）        : 64位带符号整数         例：123456
        double（double）   : 64位浮点数            例：123.0
        string（String）   : 采用UTF-8编码的字符串  例：hello,world
    2.其他数据类型，value填json，json中可以出现\${变量名}占位
        list      有序列表，例：[{"elem1":"abc"},{"elem2":"xyz"}]
        set       集合，例：["elem1","elem2"]
        map       键值对，例：{"mykey":"myvalue"}
        struct    结构体，例：{"name":"didi","age":2}
        trace     trace类型，结构不固定，请按照接口Trace参数格式填写，在需要traceId的地方使用\${traceId}占位，系统会自动生成压测traceId进行替换
            例：{"traceID":"\${traceId}","caller":"ultron","spanID":"1","hintCode":"1","hintContent":"hello11"}
三、错误码说明
    500    通用错误
    801    发送请求超时
    802    接收请求超时
    803    读取响应结果超时
`;

interface IProType {
    name: string;
    value: string;
}
const url = 'http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=170734641';
@observer
export default class ThriftConfig extends AModule<ModelThriftConfig> {
    private refFile: any = null;
    private refFiles: any = null;
    @observable public res: IProType[] = [];

    constructor(p, c) {
        super(p, c);
    }

    public componentDidMount(): void {
        this.resp();
    }

    private async resp(): Promise<void> {
        const result = await getThriftProtocoList({});
        runInAction(() => {
            this.res = result.map((it) => ({
                name: it.name,
                value: String(it.value)
            }));
        });
    }

    private async saveToServer(): Promise<boolean> {
        const results = await this.model.modelTestConfigThrift.isCanSave2();
        if (results.isPass) {
            const result = await this.model.modelTestConfigThrift.save();
            if (result.isPass) {
                message.success('保存成功');
                const query = {
                    planId: this.model.modelTestConfigThrift.planId,
                    planName: this.model.modelTestConfigThrift.planName
                };
                this.replace({ url: '/ultron/interfaceTest/thriftDetail', query });
                return Promise.resolve(true);
            } else {
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
        const result = await this.model.modelTestConfigThrift.isCanSave1();
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
                            model={ this.model.modelTestConfigThrift }
                            onChange={ this.setPlanName }
                        />
                    </div>
                    <div>分组：
                        <ObsSelectGroups
                            disabled={ this.model.modelTestConfigThrift.vIsDisabledWhenEdit }
                            style={ { width: '80%' } }
                            model={ this.model.modelTestConfigThrift }
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
            planId: this.model.modelTestConfigThrift.planId,
            planName: this.model.modelTestConfigThrift.planName
        };
        if (this.model.modelTestConfigThrift.planId) {
            this.replace({ url: '/ultron/interfaceTest/thriftDetail', query });
        } else {
            this.replace({ url: '/ultron/interfaceTest'});
        }
    }

    protected createModel(): ModelThriftConfig {
        return new ModelThriftConfig(this.query);
    }

    @Bind()
    private setGroups(val): void {
        this.model.modelTestConfigThrift.setGroups(val);
    }

    @Bind()
    private setPlanName(evt): void {
        this.model.modelTestConfigThrift.setPlanName(evt.target.value);
    }

    @Bind()
    private setMethod(val): void {
        this.model.modelTestConfigThrift.setMethod(val);
    }

    @Bind()
    private setIp(evt): void {
        this.model.modelTestConfigThrift.setIp(evt.target.value);
    }

    @Bind()
    private setPort(evt): void {
        this.model.modelTestConfigThrift.setPort(evt.target.value);
    }

    @Bind()
    private setIdl(evt): void {
        this.model.modelTestConfigThrift.setIdl(evt.target.value);
    }

    @Bind()
    private setServerName(evt): void {
        this.model.modelTestConfigThrift.setServerName(evt.target.value);
    }

    @Bind()
    private setMethodName(evt): void {
        this.model.modelTestConfigThrift.setMethodName(evt.target.value);
    }

    @Bind()
    private setTimeoutSecond(evt): void {
        this.model.modelTestConfigThrift.setTimeoutSecond(evt);
    }

    @Bind()
    private onClickFile(evt): void {
        const dom: any = ReactDOM.findDOMNode(this.refFile);
        dom.value = '';
        dom.click();
    }
    @Bind()
    private onClickFiles(evt): void {
        const dom: any = ReactDOM.findDOMNode(this.refFiles);
        dom.value = '';
        dom.click();
    }

    @Bind()
    private setFileName(evt): void {
        this.model.modelTestConfigThrift.setFileName(evt.target.value);
    }

    @Bind()
    private setIfMulti(evt): void {
        this.model.modelTestConfigThrift.setIfMulti(evt.target.checked);
    }

    @Bind()
    private setServerNames(evt): void {
        this.model.modelTestConfigThrift.setServerNames(evt.target.value);
    }

    @Bind()
    private setIfNeed(evt): void {
        this.model.modelTestConfigThrift.setIfNeed(evt.target.checked);
    }

    @Bind()
    private setFileType(evt): void {
        this.model.modelTestConfigThrift.setFileType(evt.target.value);
    }
    @Bind()
    private setIps(evt): void {
        this.model.modelTestConfigThrift.setIps(evt.target.value);
    }
    @Bind()
    private setPath(evt): void {
        this.model.modelTestConfigThrift.setPath(evt.target.value);
    }

    @Bind()
    private iconOver(): void {
        this.model.modelTestConfigThrift.isShow = true;
    }
    @Bind()
    private iconLeave(): void {
        this.model.modelTestConfigThrift.isShow = false;
    }

    @Bind()
    private async onChangeFile(evt): Promise<void> {
        const files: IFile[] = evt.target.files;
        if (files.length < 1) {
            this.model.modelTestConfigThrift.moreConfig.setFileName('');
            this.model.modelTestConfigThrift.moreConfig.isSeeButton = false;
            return;
        }
        const file = files[0];
        if (file.size < 1) {
            Modal.error({
                title: '文件有误',
                content: '文件内容不能为空'
            });
            this.model.modelTestConfigThrift.moreConfig.setFileName('');
            this.model.modelTestConfigThrift.moreConfig.isSeeButton = false;
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
            this.model.modelTestConfigThrift.moreConfig.setFileName('');
            this.model.modelTestConfigThrift.moreConfig.isSeeButton = false;
            return;
        }
        const hide = message.loading('文件上传中, 请稍后...', 0);
        const fileName = file.name;
        const data = new FormData();
        const createUser = getCookie().username || 'hanweiqi';
        data.append('file', file as any);
        data.append('createUser', createUser as any);
        try {
            this.model.modelTestConfigThrift.moreConfig.uploadPath = await uploadCsv(data);
            if (this.model.modelTestConfigThrift.moreConfig.uploadPath &&
                this.model.modelTestConfigThrift.moreConfig.uploadPath !== '') {
                this.model.modelTestConfigThrift.moreConfig.setFileName(fileName);
                this.model.modelTestConfigThrift.moreConfig.isSeeButton = true;
            } else {
                this.model.modelTestConfigThrift.moreConfig.setFileName('');
                this.model.modelTestConfigThrift.moreConfig.isSeeButton = false;
            }
        } finally { hide(); }
    }

    @Bind()
    private setRefFile(ref) { this.refFile = ref; }

    @Bind()
    public search(e): void {
        if (e.keyCode === 13) {
            if (this.model.modelTestConfigThrift.moreConfig.numberInput === '') {
                message.error('起始行不能为空');
            } else {
                this.model.modelTestConfigThrift.numberInput();
            }
        }
    }
    @Bind()
    private see(): void {
        this.model.modelTestConfigThrift.moreConfig.numberInput = '';
        // this.model.modelTestConfigThrift.moreConfig.fileContentArr = [];
        this.model.modelTestConfigThrift.getNumberInput();
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
    private async onChangeFiles(evt): Promise<void> {
        const files: IFile[] = evt.target.files;
        if (files.length < 1) {
            this.model.modelTestConfigThrift.setFileNames('');
            this.model.modelTestConfigThrift.isSeeButtons = false;
            return;
        }
        const file = files[0];
        if (file.size < 1) {
            Modal.error({
                title: '文件有误',
                content: '文件内容不能为空'
            });
            this.model.modelTestConfigThrift.setFileNames('');
            this.model.modelTestConfigThrift.isSeeButtons = false;
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
            this.model.modelTestConfigThrift.setFileNames('');
            this.model.modelTestConfigThrift.isSeeButtons = false;
            return;
        }
        const hide = message.loading('文件上传中, 请稍后...', 0);
        const fileName = file.name;
        const data = new FormData();
        const createUser = getCookie().username || 'hanweiqi';
        data.append('file', file as any);
        data.append('createUser', createUser as any);
        try {
            this.model.modelTestConfigThrift.idlPath = await jarFile(data);
            if (this.model.modelTestConfigThrift.idlPath &&
                this.model.modelTestConfigThrift.idlPath !== '') {
                this.model.modelTestConfigThrift.setFileNames(fileName);
                this.model.modelTestConfigThrift.isSeeButtons = true;
            } else {
                this.model.modelTestConfigThrift.setFileName('');
                this.model.modelTestConfigThrift.isSeeButtons = false;
            }
        } finally { hide(); }
    }

    @Bind()
    private setRefFiles(ref) { this.refFiles = ref; }
    @Bind()
    private iconOvers(): void {
        this.model.modelTestConfigThrift.isShows = true;
    }
    @Bind()
    private iconLeaves(): void {
        this.model.modelTestConfigThrift.isShows = false;
    }

    private fileRender(): React.ReactNode {
        const fileType = this.model.modelTestConfigThrift.moreConfig.fileType;
        if (fileType === '0') {
            return (
                <div>
                    <div>
                        <span>文件路径</span>
                        <ObsPathInput
                            model={ this.model.modelTestConfigThrift.moreConfig }
                            onChange={ this.setPath }
                            style={ { width: '29.5%', marginLeft: '10px', marginBottom: '15px' } }
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
                            model={ this.model.modelTestConfigThrift.moreConfig }
                            disabled={ true }
                        />
                        <Button type="primary" onClick={ this.onClickFile }>选择文件</Button>
                        {
                            this.model.modelTestConfigThrift.moreConfig.isSeeButton &&
                            this.model.modelTestConfigThrift.moreConfig.uploadPath !== '' &&
                            this.model.modelTestConfigThrift.moreConfig.uploadPath ? (
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
            <div className={ style.thrift }>
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
                                { this.model.modelTestConfigThrift.planName || '新建' }
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className={ style.saveButton }>
                        <Button type="danger" onClick={ this.onClickCancel }>取消</Button>
                        &nbsp;
                        <Button type="primary" onClick={ this.onClickSave }>保存</Button>
                    </div>
                </div>
                <div className={ style.method }>
                    <InputGroup compact={ true }>
                        <ObsSelectMethod
                            model={ this.model.modelTestConfigThrift }
                            style={ { width: '15%' } }
                            onChange={ this.setMethod }
                        >
                            {
                                this.res.map(
                                    (it) => (
                                        <Option key={ it.name } value={ it.name }>
                                            { it.value }
                                        </Option>
                                    )
                                )
                            }
                        </ObsSelectMethod>
                        <ObsInputIp
                            disabled={ this.model.modelTestConfigThrift.vIsDisabledWhenEdit }
                            model={ this.model.modelTestConfigThrift }
                            style={ { width: '80%' } }
                            placeholder="请输入IP，多个IP以“，”分割"
                            onChange={ this.setIp }
                            onPressEnter={ null }
                        />
                        <ObsInputPort
                            disabled={ this.model.modelTestConfigThrift.vIsDisabledWhenEdit }
                            model={ this.model.modelTestConfigThrift }
                            style={ { width: '5%' } }
                            placeholder="port"
                            onChange={ this.setPort }
                        />
                    </InputGroup>
                </div>
                <div>
                    { /*<span className={ style.idlSpan }>IDL文件路径:</span>*/}
                    { /*<ObsInputIdl*/}
                        { /*disabled={ this.model.modelTestConfigThrift.vIsDisabledWhenEdit }*/}
                        { /*model={ this.model.modelTestConfigThrift }*/}
                        { /*style={ { width: '93%' } }*/}
                        { /*placeholder="/home/xiaoju/data/thrift/demo/demo.idl"*/}
                        { /*onChange={ this.setIdl }*/}
                    { /*/>*/}
                    Jar文件:
                    <ObsInputFileNames
                        className={ style.fileNameInput }
                        model={ this.model.modelTestConfigThrift }
                        disabled={ true }
                        style={ { marginLeft: '15px'} }
                    />
                    <Button
                        type="primary"
                        onClick={ this.onClickFiles }
                    >选择Jar包
                    </Button>
                    <span
                        onMouseOver={ this.iconOvers }
                        onMouseLeave={ this.iconLeaves }
                        className={ style.icons }
                    >
                        <a
                            href="/new.html/ultron/tool/jarDownload"
                            target="_blank"
                        >
                            <Icon
                                type="usb"
                                style={ { color: '#1890ff' } }
                            />
                        </a>
                        {
                            this.model.modelTestConfigThrift.isShows === true ? (
                                <div className={ style.hideShows }>
                                    <p
                                        style={ { marginTop: '10px'} }
                                    >
                                        Jar生成器
                                    </p>
                                </div>
                            ) : null
                        }
                    </span>
                    <Input
                        ref={ this.setRefFiles }
                        type="file"
                        className={ style.fileInput }
                        onChange={ this.onChangeFiles }
                    />
                </div>
                <div className={ style.serverName }>
                    <span className={ style.serverNameSpan }>服务名称:</span>
                    <ObsInputServer
                        disabled={ this.model.modelTestConfigThrift.vIsDisabledWhenEdit }
                        model={ this.model.modelTestConfigThrift }
                        style={ { width: '94.5%' } }
                        placeholder="DemoService"
                        onChange={ this.setServerName }
                    />
                </div>
                <div className={ style.methodName }>
                    <span className={ style.methodNameSpan }>方法名称:</span>
                    <ObsInputMethod
                        disabled={ this.model.modelTestConfigThrift.vIsDisabledWhenEdit }
                        model={ this.model.modelTestConfigThrift }
                        style={ { width: '94.5%' } }
                        placeholder="Test"
                        onChange={ this.setMethodName }
                    />
                </div>
                <div className={ style.httpContent }>
                    <Tabs type="line">
                        <TabPane tab="参数" key="1">
                            <div className={ style.params }>
                                <NameTypeValueList
                                    model={ !this.model.modelTestConfigThrift.vIsDisabledWhenEdit ?
                                        this.model.modelTestConfigThrift.parameters :
                                        this.model.modelTestConfigThrift.parameterConfigs }
                                />
                            </div>
                        </TabPane>
                        <TabPane tab="更多配置" key="2">
                            <div className={ style.moreConfig }>
                                <div className={ style.config }>超时时间：<ObsInputTimeoutSecond
                                    min={ 1 }
                                    max={ 12000 }
                                    defaultValue={ 10000 }
                                    model={ this.model.modelTestConfigThrift.moreConfig }
                                    onChange={ this.setTimeoutSecond }
                                    style={ { marginLeft: '4px' } }
                                />&nbsp;毫秒<span style={ { color: '#ccc' } }>（取值范围为1-12000毫秒）</span></div>
                                <div className={ style.config }>
                                    <ObsIsAllowRedirect
                                        model={ this.model.modelTestConfigThrift.moreConfig }
                                        onChange={ this.setIfMulti }
                                        style={ { marginTop: '10px'} }
                                    >
                                        是否指定远端服务名称
                                    </ObsIsAllowRedirect>
                                    {
                                        this.model.modelTestConfigThrift.moreConfig.ifMulti === true ? (
                                            <ObsInputServiceName
                                                model={ this.model.modelTestConfigThrift.moreConfig }
                                                style={ { width: '302px' } }
                                                onChange={ this.setServerNames }
                                                onPressEnter={ null }
                                            />
                                        ) : null
                                    }
                                </div>
                                <div>
                                    <ObsIfNeed
                                        model={ this.model.modelTestConfigThrift.moreConfig }
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
                                            this.model.modelTestConfigThrift.isShow === true ? (
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
                                    this.model.modelTestConfigThrift.moreConfig.ifNeed === true ? (
                                        <div>
                                            <div className={ style.hideShowBox }>
                                                <ObsFileRadio
                                                    model={ this.model.modelTestConfigThrift.moreConfig }
                                                    value={ this.model.modelTestConfigThrift.moreConfig.fileType }
                                                    onChange={ this.setFileType }
                                                    style={ { marginTop: '10px'} }
                                                >
                                                    <Radio value={ '1' }>默认服务</Radio>
                                                    <Radio value={ '0' }>自定义服务</Radio>
                                                </ObsFileRadio>
                                                {
                                                    this.model.modelTestConfigThrift.moreConfig.fileType === '0' ? (
                                                        <ObsIpInput
                                                            model={ this.model.modelTestConfigThrift.moreConfig }
                                                            onChange={ this.setIps }
                                                            style={ { width: '20.5%' } }
                                                            placeholder="100.69.185.14:8095"
                                                        />
                                                    ) : null
                                                }
                                                {
                                                    this.model.modelTestConfigThrift.moreConfig.ip !== '' &&
                                                    this.model.modelTestConfigThrift.moreConfig.path !== ''
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
                        { COMMENT }
                    </pre>
                </div>
            </div>
        );
    }
}
