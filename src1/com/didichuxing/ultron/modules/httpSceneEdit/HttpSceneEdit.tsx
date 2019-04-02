import React from 'react';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Button from '@antd/button';
import Input from '@antd/input';
import Tabs from '@antd/tabs';
import Select from '@antd/select';
import Radio from '@antd/radio';
import Modal from '@antd/modal';
import Icon from '@antd/icon';
import InputNumber from '@antd/input-number';
import Checkbox from '@antd/checkbox';
import style from './HttpSceneEdit.less';
import Breadcrumb from '@antd/breadcrumb';

import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';
import { AModule } from 'com/didichuxing/commonInterface/AModule';
import { Bind } from 'lodash-decorators';
import { observer } from 'mobx-react';
import { getGroups } from '@ultron/remote/common';
import ModelSceneConfig from '@ultron/modules/httpSceneEdit/MHttpSceneEdit';
import ModalFileContent from '@ultron/modules/httpSceneEdit/modalFileContent/ModalFileContent';
import { uploadCsv, interfaceFile } from '@ultron/remote/testConfig';
import { IFile } from 'com/didichuxing/commonInterface/IWeb';
import message from '@antd/message';
import { getCookie } from '@ultron/business/common/http/cookies';

const InputGroup = Input.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const text = 'GET||http://100.69.185.15:8001/test/jmeter/queryOrder?orderCode=${orderCode}||||||';
const confirm = Modal.confirm;
const ObsPlanName = bindObserver(Input, 'planName', 'value');

const ObsInputTimeoutSecond = bindObserver(InputNumber, 'timeoutSecond', 'value');
const ObsIsKeepLongLink = bindObserver(Checkbox, 'isKeepLongLink', 'checked');
const ObsIsAllowRedirect = bindObserver(Checkbox, 'isAllowRedirect', 'checked');
const ObsMaxRedirect = bindObserver(InputNumber, 'maxRedirect', 'value');
const ObsPressureScript = bindObserver(Input.TextArea, 'pressureScript', 'value');
const ObsSelectGroups = bindObserver(Select, 'groups', 'value');
const ObsInputFileName = bindObserver(Input, 'fileName', 'value');
const ObsIfNeed = bindObserver(Checkbox, 'ifNeed', 'checked');
const ObsFileRadio = bindObserver(RadioGroup, 'fileType', 'value');
const ObsIpInput = bindObserver(Input, 'ip', 'value');
const ObsPathInput = bindObserver(Input, 'path', 'value');
const ObsIsBusinessNum = bindObserver(Checkbox, 'isBusinessNum', 'checked');
const ObsBusinessNum = bindObserver(Input, 'businessNum', 'value');

const COMMENT = `使用说明：
    1.输⼊压测脚本。
    2.在“更多配置”选项中配置请求超时时间、是否保持长连接、重定向次数、上传自定义变量csv文件等信息。
    3.简单压测脚本示例：
        场景：先请求createOrder接口创建订单，再根据响应中的orderCode请求queryOrder接口查询订单。
        脚本：
            GET||http://100.69.185.15:8001/test/jmeter/createOrder||||||
            #set($orderCode=$response.data.orderCode)
            #set($price=10)
            GET||http://100.69.185.15:8001/test/jmeter/queryOrder?orderCode=\${orderCode}&price=\${price}||||||
        注: #set为定义变量的语法，$response是内置变量，代表最近⼀个请求的响应，后有详细语法说明。
    4.压测脚本格式说明：
        1)每⾏是⼀个HTTP请求或⼀句脚本语⾔。
        2)HTTP请求格式：请求方式 || url || 请求体 || 请求头 || cookie；当请求方式为GET，请求体为空，但||分隔符不能省略。
        3)请求方式支持GET、POST、PUT。
        4)POST⽀持4种Content-Type：x-www-form-urlencoded、multipart/formdata、JSON(application/json)、Text(text/plain)
        5)URL表示请求地址。
        6)参数、请求头、cookie格式：k1::v1&k2::v2。
        7)⼀个HTTP请求的例子:
            POST||http://100.69.185.15:8001/test/jmeter/createOrder||a::1&b::2||
            Content-Type::application/x-www-form-urlencoded&a=123||JSESSIONID::123456
        8)脚本语⾔目前⽀持set、if、elif、else、for、wait等语法。
        9)$response为内置变量，代表最近一个请求的响应结果，每发送一个请求$response会更新
            使用示例：
                响应结果：
                {
                    "errno": 0,
                    "errmsg": "success",
                    "data": {
                        "orderCode":123
                    },
                    "timestamp": 1530322525199
                }
                使用方法：通过$response获取orderCode，$response.data.orderCode
        10)Content-Type为multipart/form-data的POST请求⽀持上传⽂件接口压测，首先将需要上传的文件由潘旭东上传⾄线上服务器，
           再在POST请求的参数中需要填写⽂件的地⽅以#file("⽂件名称")的⽅式使用。
           例：POST||http://10.123.123.123:8888/api/upload||lang::zh-CN&voice_file::#file("voice.mp3")||
               Content-Type::multipart/form-data||
           说明：该POST请求有两对参数，cookie为空，两对参数的key分别为lang、voice_file，value分别为zh-CN，#file("voice.mp3")。
                 voice.mp3需联系潘旭东上传至线上服务器。
    `;
const COMMENTS =
    `
    6.自定义变量csv文件说明：
        例：POST||http://100.69.185.15:8001/test/createOrder||a::\${name}||Content-Type::application/x-www-form-urlencoded
        1)可以在url，请求体，header，cookie中，使用\${变量名称}的⽅式占位。
        2)csv⽂件格式：csv文件可以有n（n>=1）行m（m>=1）列。第1行是变量名称，第[2,n]行是请求参数值；m列代表m个变量，譬如上述示例的列为name,age。
        压测期间会循环使⽤用[2,n]行的请求参数值直到压测结束，示例对应的csv文件格式如下表，name为string类型，age为i32类型：
        name,age(i32)
        Alice,10
        Bob,20
        Carol,30
        3)csv文件第一行是变量名称，默认是string类型，其他类型需要在变量名后用“()”括起来。支持的类型包括：bool、i16、i32、i64、double、string、list、map、struct。
        例：isFriday(bool)、count(i32)、price(double)。
        4)上传自定义变量csv文件目前大小只支持50M。
    7.压测流量标识：
        1)压测流量和生产流量需要隔离开来，约定使用hintCode进行区分，涉及到http/thrift/socket等多种协议。
        2)http协议中，hintCode约定放在didi-header-hint-code头字段中。hintCode & 0x01 != 0的时候为压测流量。
        3)未设置didi-header-hint-code头字段时，后端会自动加上该头，value为1。
`;
const url = 'http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=170734641';
@observer
export default class SceneConfig extends AModule<ModelSceneConfig> {
    private refFile: any = null;
    private refFiles: any = null;

    constructor(p, c) {
        super(p, c);
    }

    private async saveToServer(): Promise<boolean> {
        const results = await this.model.modelTestConfigScene.isCanSave2();
        if (results.isPass) {
            const result = await this.model.modelTestConfigScene.save();
            if (result.isPass) {
                message.success('保存成功');
                const query = {
                    planId: this.model.modelTestConfigScene.planId,
                    planName: this.model.modelTestConfigScene.planName
                };
                this.replace({ url: '/ultron/interfaceTest/httpSceneDetail', query });
            } else {
                // message.error('保存失败' + result.text);
            }
            return Promise.resolve(true);
        } else {
            message.error('请检查:，' + results.text);
            return Promise.resolve(false);
        }
    }

    @Bind()
    private async onClickSave(): Promise<void> {

        const result = await this.model.modelTestConfigScene.isCanSave1();
        if (!result.isPass) {
            Modal.error({
                title: '请检查',
                content: result.text
            });
            return Promise.resolve();
        }
        const groups = await getGroups({ type: '1' });
        confirm({
            title: '请填写名称和选择分组',
            content: (
                <div>
                    <div>名称：<ObsPlanName
                        placeholder="压测计划名称(例：乘客发单)"
                        style={ { width: '80%' } }
                        model={ this.model.modelTestConfigScene }
                        onChange={ this.setPlanName }
                    /></div>
                    <div>分组：
                        <ObsSelectGroups
                            disabled={ this.model.modelTestConfigScene.vIsDisabledWhenEdit }
                            style={ { width: '80%' } }
                            model={ this.model.modelTestConfigScene }
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
                this.saveToServer();
            }
        });
    }

    protected createModel(): ModelSceneConfig {
        return new ModelSceneConfig(this.query);
    }

    @Bind()
    private onClickCancel() {
        const query = {
            planId: this.model.modelTestConfigScene.planId,
            planName: this.model.modelTestConfigScene.planName
        };
        if (this.model.modelTestConfigScene.planId) {
            this.replace({ url: '/ultron/interfaceTest/httpSceneDetail', query });
        } else {
            this.replace({ url: '/ultron/interfaceTest' });
        }
    }

    @Bind()
    private setPlanName(evt): void {
        this.model.modelTestConfigScene.setPlanName(evt.target.value);
    }

    @Bind()
    private setGroups(evt): void {
        this.model.modelTestConfigScene.setGroups(evt);
    }

    @Bind()
    private setTimeoutSecond(evt): void {
        this.model.modelTestConfigScene.setTimeoutSecond(evt);
    }

    @Bind()
    private setIsKeepLongLink(evt): void {
        this.model.modelTestConfigScene.setIsKeepLongLink(evt.target.checked);
    }

    @Bind()
    private setIsAllowRedirect(evt): void {
        this.model.modelTestConfigScene.setIsAllowRedirect(evt.target.checked);
    }

    @Bind()
    private setMaxRedirect(evt): void {
        this.model.modelTestConfigScene.setMaxRedirect(evt);
    }

    @Bind()
    private setIsHasCustomized(evt): void {
        this.model.modelTestConfigScene.setIsHasCustomized(evt.target.checked);
    }

    @Bind()
    private onClickFile(evt): void {
        const dom: any = ReactDOM.findDOMNode(this.refFile);
        dom.value = '';
        dom.click();
    }

    @Bind()
    private onClickFiles(evt): void {
        this.model.modelTestConfigScene.index = evt.target.getAttribute('data-index');
        const dom: any = ReactDOM.findDOMNode(this.refFiles);
        dom.value = '';
        dom.click();

    }

    @Bind()
    private setPressureScript(evt): void {
        this.model.modelTestConfigScene.setPressureScript(evt.target.value);
    }

    /**
     * 是否需要文件服务
     * @param evt
     */
    @Bind()
    private setIfNeed(evt): void {
        this.model.modelTestConfigScene.setIfNeed(evt.target.checked);
    }

    /**
     * 设置IP
     * @param evt
     */
    @Bind()
    private setIp(evt): void {
        this.model.modelTestConfigScene.setIp(evt.target.value);
    }

    /**
     * 设置文件路径
     * @param evt
     */
    @Bind()
    private setPath(evt): void {
        this.model.modelTestConfigScene.setPath(evt.target.value);
    }

    /**
     * 设置服务类型
     * @param evt
     */
    @Bind()
    private setFileType(evt): void {
        this.model.modelTestConfigScene.setFileType(evt.target.value);
    }

    @Bind()
    private iconOver(): void {
        this.model.modelTestConfigScene.isShow = true;
    }
    @Bind()
    private iconOvers(): void {
        this.model.modelTestConfigScene.isShowss = true;
    }

    @Bind()
    private iconLeave(): void {
        this.model.modelTestConfigScene.isShow = false;
    }
    @Bind()
    private iconLeaves(): void {
        this.model.modelTestConfigScene.isShowss = false;
    }

    @Bind()
    private async onChangeFile(evt): Promise<void> {
        const files: IFile[] = evt.target.files;
        if (files.length < 1) {
            this.model.modelTestConfigScene.moreConfig.setFileName('');
            this.model.modelTestConfigScene.moreConfig.isSeeButton = false;
            return;
        }
        const file = files[0];
        if (file.size < 1) {
            Modal.error({
                title: '文件有误',
                content: '文件内容不能为空'
            });
            this.model.modelTestConfigScene.moreConfig.setFileName('');
            this.model.modelTestConfigScene.moreConfig.isSeeButton = false;
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
            this.model.modelTestConfigScene.moreConfig.setFileName('');
            this.model.modelTestConfigScene.moreConfig.isSeeButton = false;
            return;
        }

        const fileName = file.name;
        const createUser = getCookie().username || 'hanweiqi';
        const data = new FormData();
        data.append('file', file as any);
        data.append('createUser', createUser as any);
        try {
            this.model.modelTestConfigScene.moreConfig.uploadPath = await uploadCsv(data);
            if (this.model.modelTestConfigScene.moreConfig.uploadPath &&
                this.model.modelTestConfigScene.moreConfig.uploadPath !== '') {
                this.model.modelTestConfigScene.moreConfig.setFileName(fileName);
                this.model.modelTestConfigScene.moreConfig.isSeeButton = true;
            } else {
                this.model.modelTestConfigScene.moreConfig.setFileName('');
                this.model.modelTestConfigScene.moreConfig.isSeeButton = false;
            }
        } catch (e) {
        }
    }

    @Bind()
    private async onChangeFiles(evt): Promise<void> {
        const files: IFile[] = evt.target.files;
        if (files.length < 1) {
            // this.model.modelTestConfigScene.setFileNames('');
            return;
        }
        const file = files[0];
        if (file.size < 1) {
            Modal.error({
                title: '文件有误',
                content: '文件内容不能为空'
            });
            // this.model.modelTestConfigScene.setFileNames('');
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
            // this.model.modelTestConfigScene.setFileNames('');
            return;
        }

        // const fileName = file.name;
        const createUser = getCookie().username || 'hanweiqi';
        const data = new FormData();
        data.append('file', file as any);
        data.append('createUser', createUser as any);
        try {
            const path = this.model.modelTestConfigScene.moreConfig.uploadPath = await interfaceFile(data);
            const num = path.lastIndexOf('/');
            const pathName = path.substring(num + 1);
            this.model.modelTestConfigScene.getPath(pathName);
            this.model.modelTestConfigScene.paramsData(path);
        } catch (e) {
        }
    }

    @Bind()
    private setRefFile(ref) {
        this.refFile = ref;
    }

    @Bind()
    private setRefFiles(ref) {
        this.refFiles = ref;
    }

    @Bind()
    public search(e): void {
        if (e.keyCode === 13) {
            if (this.model.modelTestConfigScene.moreConfig.numberInput === '') {
                message.error('起始行不能为空');
            } else {
                this.model.modelTestConfigScene.numberInput();
            }
        }
    }

    @Bind()
    private see(): void {
        this.model.modelTestConfigScene.moreConfig.numberInput = '';
        // this.model.modelTestConfigScene.moreConfig.fileContentArr = [];
        this.model.modelTestConfigScene.getNumberInput();
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
        this.model.modelTestConfigScene.setIsBusinessNum(evt.target.checked);
    }
    @Bind()
    private setBusinessNum(evt): void {
        this.model.modelTestConfigScene.setBusinessNum(evt.target.value);
    }

    private fileRender(): React.ReactNode {
        const fileType = this.model.modelTestConfigScene.moreConfig.fileType;
        if (fileType === '0') {
            return (
                <div>
                    <div className={ style.filePath }>
                        <span>文件路径</span>
                        <ObsPathInput
                            model={ this.model.modelTestConfigScene.moreConfig }
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
                            model={ this.model.modelTestConfigScene.moreConfig }
                            disabled={ true }
                        />
                        <Button type="primary" onClick={ this.onClickFile }>选择文件</Button>
                        {
                            this.model.modelTestConfigScene.moreConfig.isSeeButton &&
                            this.model.modelTestConfigScene.moreConfig.uploadPath !== '' &&
                            this.model.modelTestConfigScene.moreConfig.uploadPath ? (
                                <Button
                                    style={ { marginLeft: '15px' } }
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
            <div className={ style.scene }>
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
                                { this.model.modelTestConfigScene.planName || '新建' }
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className={ style.saveButton }>
                        <Button type="danger" onClick={ this.onClickCancel }>取消</Button>
                        &nbsp;
                        <Button type="primary" onClick={ this.onClickSave }>保存</Button>
                    </div>
                </div>
                <div className={ style.sceneContent }>
                    <span
                        onMouseOver={ this.iconOvers }
                        onMouseLeave={ this.iconLeaves }
                        className={ style.icons }
                    >
                        <Icon
                            type="question-circle"
                            style={ { color: '#1890ff' } }
                        />
                        {
                            this.model.modelTestConfigScene.isShowss === true ? (
                                <div className={ style.hideShows }>
                                    <p>1.接口Content-type为multipart/form-data，参数包含文件，在此上传</p>
                                    <p>2.脚本中通过#file("文件名")引用文件，详情请查看
                                        <a
                                            href={ url }
                                            target="_blank"
                                        >文件使用手册
                                        </a>
                                    </p>
                                </div>
                            ) : null
                        }
                    </span>
                    <Tabs type="line">
                        <TabPane tab="压测脚本" key="1">
                            <div style={ { minHeight: '220px' } }>
                                <ObsPressureScript
                                    rows={ 7 }
                                    placeholder="请输入脚本:"
                                    model={ this.model.modelTestConfigScene }
                                    onChange={ this.setPressureScript }
                                />
                            </div>
                        </TabPane>
                        <TabPane tab="更多配置" key="2">
                            <div style={ { minHeight: '220px' } } className={ style.configBox }>
                                <div className={ style.config }>超时时间&nbsp;:&nbsp;<ObsInputTimeoutSecond
                                    min={ 1 }
                                    max={ 12000 }
                                    defaultValue={ 10000 }
                                    model={ this.model.modelTestConfigScene.moreConfig }
                                    onChange={ this.setTimeoutSecond }
                                />&nbsp;毫秒<span style={ { color: '#ccc' } }>（取值范围为1-12000毫秒）</span></div>
                                <div className={ style.config }>
                                    <ObsIsKeepLongLink
                                        model={ this.model.modelTestConfigScene.moreConfig }
                                        onChange={ this.setIsKeepLongLink }
                                    >保持长连接
                                    </ObsIsKeepLongLink>
                                </div>
                                <div className={ style.config }>
                                    <ObsIsAllowRedirect
                                        model={ this.model.modelTestConfigScene.moreConfig }
                                        onChange={ this.setIsAllowRedirect }
                                    >
                                        允许重定向
                                    </ObsIsAllowRedirect>
                                    <span
                                        className={
                                            this.model.modelTestConfigScene.moreConfig.maxRedirect < 1 ?
                                                style.spanMaxRedirectNone :
                                                style.spanMaxRedirect
                                        }
                                    >
                                        ，最多
                                        <ObsMaxRedirect
                                            min={ 1 }
                                            max={ 10 }
                                            defaultValue={ 10 }
                                            model={ this.model.modelTestConfigScene.moreConfig }
                                            onChange={ this.setMaxRedirect }
                                        />&nbsp;次
                                    </span>
                                </div>
                                <div className={ style.config }>
                                    <ObsIsBusinessNum
                                        model={ this.model.modelTestConfigScene.moreConfig }
                                        onChange={ this.setIsBusinessNum }
                                    >
                                        业务码统计
                                    </ObsIsBusinessNum>
                                    {
                                        this.model.modelTestConfigScene.moreConfig.isBusinessNum === true ? (
                                            <ObsBusinessNum
                                                model={ this.model.modelTestConfigScene.moreConfig }
                                                onChange={ this.setBusinessNum }
                                                style={ { width: '200px'} }
                                            />
                                        ) : null
                                    }
                                </div>
                                <div>
                                    <ObsIfNeed
                                        model={ this.model.modelTestConfigScene.moreConfig }
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
                                            this.model.modelTestConfigScene.isShow === true ? (
                                                <div className={ style.hideShow }>
                                                    <p
                                                        style={ { marginTop: '10px' } }
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
                                    this.model.modelTestConfigScene.moreConfig.ifNeed === true ? (
                                        <div>
                                            <div className={ style.hideShowBox }>
                                                <ObsFileRadio
                                                    model={ this.model.modelTestConfigScene.moreConfig }
                                                    value={ this.model.modelTestConfigScene.moreConfig.fileType }
                                                    onChange={ this.setFileType }
                                                    style={ { marginTop: '10px' } }
                                                >
                                                    <Radio value={ '1' }>默认服务</Radio>
                                                    <Radio value={ '0' }>自定义服务</Radio>
                                                </ObsFileRadio>
                                                {
                                                    this.model.modelTestConfigScene.moreConfig.fileType === '0' ? (
                                                        <ObsIpInput
                                                            model={ this.model.modelTestConfigScene.moreConfig }
                                                            onChange={ this.setIp }
                                                            style={ { width: '20.5%' } }
                                                            placeholder="100.69.185.14:8095"
                                                        />
                                                    ) : null
                                                }
                                                {
                                                    this.model.modelTestConfigScene.moreConfig.ip !== '' &&
                                                    this.model.modelTestConfigScene.moreConfig.path !== ''
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
                                            <div style={ { marginTop: '10px' } }>
                                                { this.fileRender() }
                                            </div>
                                        </div>
                                    ) : null
                                }
                            </div>
                        </TabPane>
                        <TabPane tab="文件列表" key="3">
                            <div style={ { minHeight: '220px' } }>
                                {
                                    this.model.modelTestConfigScene.getList.map((it, index) => {
                                        const reduceClick = () => {
                                            if (this.model.modelTestConfigScene.getList.length < 2) {
                                                this.model.modelTestConfigScene.getList = [''];
                                                this.model.modelTestConfigScene.paramsLists = [''];
                                            } else {
                                                this.model.modelTestConfigScene.getList.splice(index, 1);
                                                this.model.modelTestConfigScene.paramsLists.splice(index, 1);
                                            }
                                        };
                                        const addClick = () => {
                                            if (this.model.modelTestConfigScene.getList.length <= 4) {
                                                this.model.modelTestConfigScene.getList.splice(index + 1, 0, '');
                                                this.model.modelTestConfigScene.paramsLists.splice(index + 1, 0, '');
                                            }
                                        };
                                        return (
                                            <div
                                                className={ style.config }
                                                key={ index }
                                                style={ { marginBottom: '10px' } }
                                            >
                                                文件&nbsp;
                                                <Input
                                                    className={ style.fileNameInput }
                                                    value={ it }
                                                    disabled={ true }
                                                />
                                                <Button
                                                    type="primary"
                                                    onClick={ this.onClickFiles }
                                                    data-index={ index }
                                                >选择文件
                                                </Button>
                                                <Button
                                                    style={ { marginLeft: '10px' } }
                                                    onClick={ addClick }
                                                >
                                                    增加
                                                </Button>
                                                <Button
                                                    type="danger"
                                                    style={ { marginLeft: '10px' } }
                                                    onClick={ reduceClick }
                                                >
                                                    删除
                                                </Button>
                                            </div>
                                        );
                                    })
                                }
                                <Input
                                    ref={ this.setRefFiles }
                                    type="file"
                                    className={ style.fileInput }
                                    onChange={ this.onChangeFiles }
                                />
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
                <div>
                    <pre className={ style.comment }>
                        { COMMENT }
                        5.脚本语法
                        <a
                            href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=148520866&moved=true"
                            target="_blank"
                        >点击查看
                        </a>
                        { COMMENTS }
                    </pre>
                </div>
            </div>
        );
    }
}
