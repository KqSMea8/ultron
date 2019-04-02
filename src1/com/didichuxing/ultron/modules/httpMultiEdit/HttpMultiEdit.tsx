import React from 'react';
import ReactDOM from 'react-dom';
import {RouteComponentProps, Link, Redirect} from 'react-router-dom';
import {AModule} from 'com/didichuxing/commonInterface/AModule';
import {observer} from 'mobx-react';
import ModelHttpMultiConfig from '@ultron/modules/httpMultiEdit/MHttpMultiEdit';
import ModalFileContent from '@ultron/modules/httpMultiEdit/modalFileContent/ModalFileContent';
import {Bind} from 'lodash-decorators';
import {bindObserver} from 'com/didichuxing/commonInterface/TwoWayBinding';
import NameValueList from '@ultron/components/modelNameValue/views/ViewNameValueList';
import {getGroups} from '@ultron/remote/common';
import { IFile } from 'com/didichuxing/commonInterface/IWeb';
import { uploadLog } from '@ultron/remote/testConfig';
import { getCookie } from '@ultron/business/common/http/cookies';

import Modal from '@antd/modal';
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
import style from './HttpMultiEdit.less';

const InputGroup = Input.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const confirm = Modal.confirm;

const ObsInputTimeoutSecond = bindObserver(InputNumber, 'timeoutSecond', 'value');
const ObsIsKeepLongLink = bindObserver(Checkbox, 'isKeepLongLink', 'checked');
const ObsIsAllowRedirect = bindObserver(Checkbox, 'isAllowRedirect', 'checked');
const ObsMaxRedirect = bindObserver(InputNumber, 'maxRedirect', 'value');
const ObsUrlPrefix = bindObserver(Input, 'urlPrefix', 'value');
const ObsFilePaths = bindObserver(Input, 'customFilePath', 'value');
const ObsSelectGroups = bindObserver(Select, 'groups', 'value');
const ObsCustomOrDefault = bindObserver(RadioGroup, 'CustomOrDefault', 'value');
const ObsInputPlanName = bindObserver(Input, 'planName', 'value');
const ObsRequestLog = bindObserver(Input.TextArea, 'vRequestLog', 'value');
const ObsCustomInput = bindObserver(Input, 'customInput', 'value');
const ObsInputFileName = bindObserver(Input, 'fileName', 'value');
const ObsIsBusinessNum = bindObserver(Checkbox, 'isBusinessNum', 'checked');
const ObsBusinessNum = bindObserver(Input, 'businessNum', 'value');

const COMMENT = `使用说明：
    1.通过"日志⽂件"或"⼿动输⼊"的方式确定HTTP⽇志。
        ⽇志示例：
	    GET||www.host.com:port/api/v1/url1
	    GET||www.host.com:port/api/v1/url2
	    POST||www.host.com:port/api/v1/url3||{"name":"Alice","age":"17"}
	    GET||www.host.com:port/api/v1/url1
        ⽇志格式说明：
            1）每⾏代表一个请求，多个请求从上至下顺序访问。
            2）每⾏请求的格式为：
                GET请求：GET || URL
                POST请求：POST || URL || body
            3）URL表示请求地址，若URL不包含Host:port信息，则需要设置URL前缀。
                以下两种URL都是有效的：
                不需要设置URL前缀：www.host.com:port/api/v1/url1
                需要设置URL前缀：/api/v1/url1
                URL前缀格式：scheme://host:port，scheme可为http或https
            4）POST请求中body为请求体，需要在Headers设置Content-Type字段。
            5）Content-Type支持三种：application/x-www-form-urlencoded、application/json、text/plain
            6）⼀个日志⽂文件，允许混合包含GET和POST请求，此时要为POST请求在Headers设置Content-Type字段，目前⼀个⽇志中所有POST请求要求Content-Type相同。
    2.选择⽂件服务，可选择"默认服务"或"⾃定义"。
        选择"默认服务"表示使⽤Ultron平台数据源，需要联系潘旭东上传日志文件；
        选择"自定义"表示使⽤自建的数据源，需要填写⾃建数据源地址，⾃建数据源请联系潘旭东。
    3.输入Headers、Cookies。
    4.在"更多配置"选项中配置请求超时时间、是否保持⻓连接、重定向次数等信息。
    5.压测流量标识：
        1)压测流量和生产流量需要隔离开来，约定使用hintCode进行区分，涉及到http/thrift/socket等多种协议。
        2)http协议中，hintCode约定放在didi-header-hint-code头字段中。hintCode & 0x01 != 0的时候为压测流量。
        3)未设置didi-header-hint-code头字段时，后端会自动加上该头，value为1。
`;
const url = 'http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=170734641';
@observer
export default class HttpMultiConfig extends AModule<ModelHttpMultiConfig> {
    private refFile: any = null;

    constructor(p, c) {
        super(p, c);
        this.state = {
            isShow: '1'
        };
    }

    private async saveToServer(): Promise<boolean> {
        const results = await this.model.modelTestConfigMH.isCanSave2();
        if (results.isPass) {
            const result = await this.model.modelTestConfigMH.save();
            if (result.isPass) {
                message.success('保存成功');
                const query = {
                    planId: this.model.modelTestConfigMH.planId,
                    planName: this.model.modelTestConfigMH.planName
                };
                this.replace({url: '/ultron/interfaceTest/httpMultiDetail', query});
            } else {
                // message.error('保存失败：' + result.text);
            }
            return Promise.resolve(true);
        } else {
            message.error('请检查：，' + results.text);
            return Promise.resolve(false);
        }
    }

    @Bind()
    private async onClickSave(): Promise<void> {

        const result = await this.model.modelTestConfigMH.isCanSave1();
        if (!result.isPass) {
            message.error('请检查：' + result.text);
            return Promise.resolve();
        }
        const groups = await getGroups({type: '1'});
        confirm({
            title: '请填写名称和选择分组',
            content: (
                <div>
                    <div>名称：
                        <ObsInputPlanName
                            placeholder="压测计划名称(例：乘客发单)"
                            style={ {width: '80%'} }
                            model={ this.model.modelTestConfigMH }
                            onChange={ this.setPlanName }
                        />
                    </div>
                    <div>分组：
                        <ObsSelectGroups
                            disabled={ this.model.modelTestConfigMH.vIsDisabledWhenEdit }
                            style={ {width: '80%'} }
                            model={ this.model.modelTestConfigMH }
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

    protected createModel(): ModelHttpMultiConfig {
        return new ModelHttpMultiConfig(this.query);
    }

    @Bind()
    private onClickCancel() {
        const query = {
            planId: this.model.modelTestConfigMH.planId,
            planName: this.model.modelTestConfigMH.planName
        };
        if (this.model.modelTestConfigMH.planId) {
            this.replace({ url: '/ultron/interfaceTest/httpMultiDetail', query });
        } else {
            this.replace({ url: '/ultron/interfaceTest'});
        }
    }

    @Bind()
    private setTimeoutSecond(evt): void {
        this.model.modelTestConfigMH.setTimeoutSecond(evt);
    }

    @Bind()
    private setIsKeepLongLink(evt): void {
        this.model.modelTestConfigMH.setIsKeepLongLink(evt.target.checked);
    }

    @Bind()
    private setIsAllowRedirect(evt): void {
        this.model.modelTestConfigMH.setIsAllowRedirect(evt.target.checked);
    }

    @Bind()
    private setMaxRedirect(evt): void {
        this.model.modelTestConfigMH.setMaxRedirect(evt);
    }

    @Bind()
    private setPlanName(evt): void {
        this.model.modelTestConfigMH.setPlanName(evt.target.value);
    }

    @Bind()
    private setGroups(evt): void {
        this.model.modelTestConfigMH.setGroups(evt);
    }

    @Bind()
    private setTypeChange(evt): void {
        this.model.modelTestConfigMH.setServiceType(evt.target.value);
        this.setState({
            isShow: evt.target.value
        });
    }

    @Bind()
    private  setUrlPrefix(evt): void {
        this.model.modelTestConfigMH.setUrlPrefix(evt.target.value);
    }

    @Bind()
    private setRequestLog(evt): void {
        this.model.modelTestConfigMH.setRequestLog(evt.target.value);
    }

    @Bind()
    private setCustomInput(evt): void {
        this.model.modelTestConfigMH.setCustomInput(evt.target.value);
    }
    @Bind()
    private setCustomFilePath(evt): void {
        this.model.modelTestConfigMH.setCustomFilePath(evt.target.value);
    }

    @Bind()
    private setDfaultService(evt): void {
        this.model.modelTestConfigMH.setDfaultService(evt);
    }

    @Bind()
    private iconOver(): void {
        this.model.modelTestConfigMH.isShow = true;
    }
    @Bind()
    private iconLeave(): void {
        this.model.modelTestConfigMH.isShow = false;
    }

    @Bind()
    private async onChangeFile(evt): Promise<void> {
        const files: IFile[] = evt.target.files;
        if (files.length < 1) {
            this.model.modelTestConfigMH.httpLog.setFileName('');
            this.model.modelTestConfigMH.httpLog.isSeeButton = false;
            return;
        }
        const file = files[0];
        if (file.size < 1) {
            Modal.error({
                title: '文件有误',
                content: '文件内容不能为空'
            });
            this.model.modelTestConfigMH.httpLog.setFileName('');
            this.model.modelTestConfigMH.httpLog.isSeeButton = false;
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
            this.model.modelTestConfigMH.httpLog.setFileName('');
            this.model.modelTestConfigMH.httpLog.isSeeButton = false;
            return;
        }
        const hide = message.loading('文件上传中, 请稍后...', 0);
        const fileName = file.name;
        const createUser = getCookie().username || 'hanweiqi';
        const data = new FormData();
        data.append('file', file as any);
        data.append('createUser', createUser as any);
        try {
            this.model.modelTestConfigMH.httpLog.uploadPath = await uploadLog(data);
            if (this.model.modelTestConfigMH.httpLog.uploadPath &&
                this.model.modelTestConfigMH.httpLog.uploadPath !== '') {
                this.model.modelTestConfigMH.httpLog.setFileName(fileName);
                this.model.modelTestConfigMH.httpLog.isSeeButton = true;
            } else {
                this.model.modelTestConfigMH.httpLog.setFileName('');
                this.model.modelTestConfigMH.httpLog.isSeeButton = false;
            }
        } finally { hide(); }
    }

    @Bind()
    private onClickFile(evt): void {
        const dom: any = ReactDOM.findDOMNode(this.refFile);
        dom.value = '';
        dom.click();
    }

    @Bind()
    private setRefFile(ref) { this.refFile = ref; }

    @Bind()
    public search(e): void {
        if (e.keyCode === 13) {
            if (this.model.modelTestConfigMH.httpLog.numberInput === '') {
                message.error('起始行不能为空');
            } else {
                this.model.modelTestConfigMH.numberInput();
            }
        }
    }
    @Bind()
    private see(): void {
        this.model.modelTestConfigMH.httpLog.numberInput = '';
        // this.model.modelTestConfigMH.httpLog.fileContentArr = [];
        this.model.modelTestConfigMH.getNumberInput();
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
    private setIsBusinessNum(evt): void {
        this.model.modelTestConfigMH.setIsBusinessNum(evt.target.checked);
    }
    @Bind()
    private setBusinessNum(evt): void {
        this.model.modelTestConfigMH.setBusinessNum(evt.target.value);
    }

    public render(): React.ReactNode {
        return (
            <div className={ style.httpMulti }>
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
                                { this.model.modelTestConfigMH.planName || '新建' }
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className={ style.saveButton }>
                        <Button type="danger" onClick={ this.onClickCancel }>取消</Button>
                        &nbsp;
                        <Button type="primary" onClick={ this.onClickSave }>保存</Button>
                    </div>
                </div>
                <div className={ style.httpContent }>
                    <Tabs type="line" defaultActiveKey="1">
                        <TabPane tab="HTTP日志" key="1">
                            <div className={ style.log }>
                                <Tabs
                                      type="card"
                                      activeKey={ this.model.modelTestConfigMH.vSmallTabKey }
                                      onChange={ this.model.modelTestConfigMH.setSmallTabKey }
                                >
                                    <TabPane tab="日志文件" key="11">
                                        <div>
                                            文件服务：
                                            <ObsCustomOrDefault
                                                defaultValue="1"
                                                onChange={ this.setTypeChange }
                                                model={ this.model.modelTestConfigMH }
                                            >
                                                <Radio value="1">默认服务</Radio>
                                                <Radio value="2">自定义服务</Radio>
                                            </ObsCustomOrDefault>
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
                                                    this.model.modelTestConfigMH.isShow === true ? (
                                                        <div className={ style.hideShow }>
                                                            <p
                                                                style={ { marginTop: '10px'} }
                                                            >1.小于50M的文件可以使用默认服务，默认服务支持.log，.tar.gz格式文件，具体文件要求参考
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
                                            {
                                                this.state.isShow === '2' ||
                                                this.model.modelTestConfigMH.CustomOrDefault === '2' ?
                                                    < ObsCustomInput
                                                        placeholder="100.69.185.14:8095"
                                                        style={ {width: '30%'} }
                                                        model={ this.model.modelTestConfigMH.httpLog }
                                                        onChange={ this.setCustomInput }
                                                    />
                                                    : null
                                            }
                                            {
                                                this.model.modelTestConfigMH.CustomOrDefault === '2' &&
                                                this.model.modelTestConfigMH.httpLog.customInput !== '' &&
                                                this.model.modelTestConfigMH.httpLog.customFilePath !== ''
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
                                        {
                                            this.model.modelTestConfigMH.CustomOrDefault === '2' ? (
                                                <div style={ { marginTop: '10px'} }>
                                                    文件路径：
                                                    <ObsFilePaths
                                                        placeholder="/home/xiaoju/data/test.log"
                                                        style={ {width: '90%'} }
                                                        model={ this.model.modelTestConfigMH.httpLog }
                                                        onChange={ this.setCustomFilePath }
                                                    />
                                                </div>
                                            ) : (
                                                <div className={ style.filePath }>
                                                    <div className={ style.config }>
                                                        日志文件：
                                                        <ObsInputFileName
                                                            className={ style.fileNameInput }
                                                            model={ this.model.modelTestConfigMH.httpLog }
                                                            disabled={ true }
                                                        />
                                                        <Button
                                                            type="primary"
                                                            onClick={ this.onClickFile }
                                                        >选择文件
                                                        </Button>
                                                        {
                                                            this.model.modelTestConfigMH.httpLog.isSeeButton &&
                                                            this.model.modelTestConfigMH.httpLog.uploadPath !== '' &&
                                                            this.model.modelTestConfigMH.httpLog.uploadPath ? (
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
                                            )
                                        }
                                        <div className={ style.urlPrefix }>
                                            URL前缀：
                                            <ObsUrlPrefix
                                                placeholder="若日志文件中的URL已包含Host/port等信息，则无需再填"
                                                style={ {width: '90%'} }
                                                model={ this.model.modelTestConfigMH.httpLog }
                                                onChange={ this.setUrlPrefix }
                                            />
                                        </div>
                                    </TabPane>
                                    <TabPane tab="手动输入" key="22">
                                        <div>
                                            <span className={ style.topRequestLog }>请求日志：</span>
                                            <ObsRequestLog
                                                placeholder="POST||www.host.com:port/api/v1/url3/||{a:b,c:d}"
                                                rows={ 4 }
                                                model={ this.model.modelTestConfigMH.httpLog }
                                                onChange={ this.setRequestLog }
                                                style={ {width: '90%'} }
                                            />
                                        </div>
                                        <div className={ style.requestLogUrl }>
                                            URL前缀：
                                            <ObsUrlPrefix
                                                placeholder="若日志文件中的URL已包含Host/port等信息，则无需再填"
                                                style={ {width: '90%'} }
                                                model={ this.model.modelTestConfigMH.httpLog }
                                                onChange={ this.setUrlPrefix }
                                            />
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </TabPane>
                        <TabPane tab="Headers" key="2">
                            <div className={ style.headerNameValue }>
                                <NameValueList model={ this.model.modelTestConfigMH.headers }/>
                            </div>
                        </TabPane>
                        <TabPane tab="Cookies" key="3">
                            <div className={ style.cookieNameValue }>
                                <NameValueList model={ this.model.modelTestConfigMH.cookies }/>
                            </div>
                        </TabPane>
                        <TabPane tab="更多配置" key="4">
                            <div style={ {height: '220px'} } className={ style.configBox }>
                                <div className={ style.config }>超时时间&nbsp;:&nbsp;<ObsInputTimeoutSecond
                                    min={ 1 }
                                    max={ 12000 }
                                    defaultValue={ 10000 }
                                    model={ this.model.modelTestConfigMH.moreConfig }
                                    onChange={ this.setTimeoutSecond }
                                />&nbsp;毫秒<span style={ {color: '#ccc'} }>（取值范围为1-12000毫秒）</span></div>
                                <div className={ style.config }>
                                    <ObsIsKeepLongLink
                                        model={ this.model.modelTestConfigMH.moreConfig }
                                        onChange={ this.setIsKeepLongLink }
                                    >保持长连接
                                    </ObsIsKeepLongLink>
                                </div>
                                <div className={ style.config }>
                                    <ObsIsAllowRedirect
                                        model={ this.model.modelTestConfigMH.moreConfig }
                                        onChange={ this.setIsAllowRedirect }
                                    >
                                        允许重定向
                                    </ObsIsAllowRedirect>
                                    <span
                                        className={
                                            this.model.modelTestConfigMH.moreConfig.maxRedirect < 1 ?
                                                style.spanMaxRedirectNone :
                                                style.spanMaxRedirect
                                        }
                                    >
                                        ，最多
                                        <ObsMaxRedirect
                                            min={ 1 }
                                            max={ 10 }
                                            defaultValue={ 10 }
                                            model={ this.model.modelTestConfigMH.moreConfig }
                                            onChange={ this.setMaxRedirect }
                                        />&nbsp;次
                                    </span>
                                </div>
                                <div className={ style.config }>
                                    <ObsIsBusinessNum
                                        model={ this.model.modelTestConfigMH.moreConfig }
                                        onChange={ this.setIsBusinessNum }
                                    >
                                        业务码统计
                                    </ObsIsBusinessNum>
                                    {
                                        this.model.modelTestConfigMH.moreConfig.isBusinessNum === true ? (
                                            <ObsBusinessNum
                                                model={ this.model.modelTestConfigMH.moreConfig }
                                                onChange={ this.setBusinessNum }
                                                style={ { width: '200px'} }
                                            />
                                        ) : null
                                    }
                                </div>
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
