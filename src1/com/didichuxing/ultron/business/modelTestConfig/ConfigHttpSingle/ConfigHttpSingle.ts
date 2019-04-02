import { IIsCanSave } from 'com/didichuxing/commonInterface/IIsCanSave';
import { IReturn as IEndpointsList } from 'com/didichuxing/ultron/remote/testConfig/interfaces/IGetEndpointsList';
import { IResultBoolean } from 'com/didichuxing/commonInterface/IResultBoolean';
import AModelTestConfig from 'com/didichuxing/ultron/business/modelTestConfig/models/AConfig';
import ModelNameValueList from 'com/didichuxing/ultron/components/modelNameValue/models/ModelNameValueList';
import ModelNameValue from 'com/didichuxing/ultron/components/modelNameValue/models/ModelNameValue';
import {
    createConfigHttpSingle, getPressureDetailsHS, updataConfigHS, getEndpointsList
} from '@ultron/remote/testConfig';
import { getFileContent } from '@ultron/remote/common';
import { observable, action, runInAction, computed } from 'mobx';
import { ETestConfigType, textTestConfigType } from '@ultron/business/common/enum/ETestConfigType';
import { i18nConfigHttpSingle as i18n } from '@ultron/business/modelTestConfig/ConfigHttpSingle';

/**
 * import parseInt = require( 'core-js/fn/number/parse-int' );
 */
const MAP_BODY = {
    text: {
        contentType: 'text/plain;charset=utf-8',
        placeholder: ''
    },
    json: {
        contentType: 'application/json;charset=utf-8',
        placeholder: '{"a":1,"b":2}'
    },
    urlencoded: {
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        placeholder: 'a=1&b=2'
    },
    file: {
        placeholder: '请选择你要上传的文件'
    }
};

/**
 * Http单接口更多配置业务模型
 */
class ConfigSingleHttpMore implements IIsCanSave {
    @observable public timeoutSecond: number = 10000;
    @observable public isKeepLongLink: boolean = true;
    @observable public isAllowRedirect: boolean = true;
    @observable public maxRedirect: number = 10;
    @observable public isHasCustomizedVar: boolean = false;
    @observable public customizedVar: string = '';
    @observable public isHasCustomizedIndexErrno: boolean = false;
    @observable public fileName: string = '';
    @observable public ifNeed: boolean = false;
    @observable public ifNeedFileServer: string = '';
    @observable public fileType: string = '1';
    @observable public fileServer: any = null;
    @observable public ip: string = '';
    @observable public path: string = '';
    @observable public uploadPath: any = '';
    @observable public numberInput: string = '';
    @observable public fileContentArr: any[] = [];
    @observable public isBusinessNum: boolean = false;
    @observable public businessNum: string = 'errno';

    @action
    public setFileName(val: string) {
        this.fileName = val;
    }

    /**
     * 保存：前置检查，可取消保存操作
     * @returns {Promise<boolean>}
     */

    public async isCanSave(): Promise<IResultBoolean> {
        return new Promise<IResultBoolean>((resolve) => {
            let result = {
                text: '',
                isPass: true
            };
            if (this.isAllowRedirect) {
                if (this.maxRedirect < 1 || this.maxRedirect > 10) {
                    result = {
                        text: i18n.current.maxRedirect,
                        isPass: false
                    };
                }
            } else if (this.timeoutSecond < 1 || this.timeoutSecond > 12000) {
                result = {
                    text: '超时时间取值范围应该在1-12000毫秒之间',
                    isPass: false
                };
            } else if (this.isHasCustomizedVar) {
                if (this.fileName === '') {
                    result = {
                        text: '文件选择不正确',
                        isPass: false
                    };
                }
            }
            resolve(result);
        });
    }
}

/**
 * Http单接口测试配置业务模型
 */
export default class ModelTestConfigSingleHttp extends AModelTestConfig {
    @observable public planId?: string = '';
    @observable public cloneId?: string = '';
    public readonly type = ETestConfigType.HttpSingle;
    @observable public method: string = 'GET';
    @observable public url: string = 'http://';
    public headers: ModelNameValueList;
    public cookies: ModelNameValueList;
    @observable public bodyType: string = 'urlencoded';
    @observable public bodyContent: any = '';
    @observable public bodyPlaceholder: any = MAP_BODY.urlencoded.placeholder;
    public moreConfig = new ConfigSingleHttpMore();
    @observable public instructions?: any = '';
    @observable public planName?: any = '';
    @observable public groups: string = '15'; // 此处下拉是获取接口的数据
    @observable public settingType: string = '1'; // diSf 默认或者是DiSF
    @observable public info: string = ''; // diSf
    @observable public DiSFValue: string = '';
    @observable public colonyValue: string = '';
    @observable public odinValue: string = '';
    @observable public odinPortValue: string = '';
    @observable public colonyMethod: string = 'http';
    @observable public odinMethod: string = 'http';
    @observable public isOdinTree: boolean = false;
    @observable public endpointsList: IEndpointsList = [];
    @observable public isShow: boolean = false;
    @observable public isSeeButton: boolean = true;
    private tempUrl: string = '';
    public placeHolder: string = '';

    private maxRedirectPre = 10;

    constructor(planId?: string, planName?: any, cloneId?: string) {
        super();
        this.headers = new ModelNameValueList();
        this.cookies = new ModelNameValueList();
        if (planId) {
            this.initByPlanId(planId, planName);
        } else if (cloneId) {
            this.initByPlanId(cloneId);
        } else {
            this.headers.add(new ModelNameValue({
                placeholderPrefix: 'Header'
            }));
            this.cookies.add(new ModelNameValue({
                placeholderPrefix: 'Cookie'
            }));
        }
        this.setPlaceHolder();
    }

    @computed
    public get isBodyDisabled(): boolean {
        return this.method === 'GET' || this.method === 'DELETE';
    }

    /**
     * http单接口查看，请求接口数据再进行赋值
     * @param planId
     * @returns {Promise<void>}
     */
    private async initByPlanId(planId: string, planName?: string): Promise<void> {
        const respData = await getPressureDetailsHS({ planId: planId });
        runInAction(() => {
            if (planName) {
                this.planId = planId;
                this.planName = respData.planName;
            } else {
                this.planName = '';
            }
            this.url = respData.url;
            this.method = respData.method;
            this.groups = String(respData.groupNumber);
            this.bodyContent = respData.body;
            this.settingType = (respData.service || { type: 1 }).type.toString();
            this.info = (respData.service || { info: '' }).info;
            this.moreConfig.timeoutSecond = respData.more.timeout;
            this.moreConfig.isKeepLongLink = respData.more.keepAlive;
            this.moreConfig.maxRedirect = respData.more.maxRedirects;
            this.moreConfig.fileType = String(respData.more.ifDefaultFileServer);
            this.moreConfig.businessNum = respData.more.businessCode;
            if (this.moreConfig.businessNum !== '') {
                this.moreConfig.isBusinessNum = true;
            } else {
                this.moreConfig.isBusinessNum = false;
            }
            if (this.moreConfig.maxRedirect < 1) {
                this.moreConfig.isAllowRedirect = false;
            }
            this.moreConfig.fileName = respData.more.fileName;
            if (
                this.moreConfig.fileType !== '0' &&
                this.moreConfig.fileType !== '1') {
                this.moreConfig.ifNeed = false;
                this.moreConfig.ifNeedFileServer = '0';
            } else {
                this.moreConfig.ifNeed = true;
                this.moreConfig.ifNeedFileServer = '1';
                this.moreConfig.fileType = String(respData.more.ifDefaultFileServer);
                if (this.moreConfig.fileType === '1') {
                    this.moreConfig.fileName = respData.more.fileName;
                    this.moreConfig.uploadPath = respData.more.path;
                } else {
                    this.moreConfig.ip = respData.more.ip;
                    this.moreConfig.path = respData.more.path;
                }
            }
            this.headers.fromPlainObject(respData.headers || {}, 'Header');
            this.cookies.fromPlainObject(respData.cookies || {}, 'Cookie');
        });
        this.initValue();
        this.showUrl();
    }

    /**
     * 保存：前置检查，可取消保存操作
     * @returns {Promise<boolean>}
     */
    public async isCanSave(): Promise<IResultBoolean> {
        let result = {
            text: '',
            isPass: true
        };

        result = await this.isCanSave1();
        if (result.isPass) {
            result = await this.isCanSave2();
        }
        if (result.isPass) {
            result = await this.isCanSave4();
        }
        if (this.settingType === '3' && result.isPass) {
            result = await this.isCanSave3();
        }
        return new Promise<IResultBoolean>((resolve) => {
            resolve(result);
        });
    }

    public async isCanSave1(): Promise<IResultBoolean> {
        let result = {
            text: '',
            isPass: true
        };
        if (!this.url || this.url === 'http://' || this.url === 'https://') {
            result = {
                text: 'URL不能为空',
                isPass: false
            };
        } else if (this.settingType === '3' && !this.DiSFValue) {
            result = {
                text: 'DiSF不能为空',
                isPass: false
            };
        } else if (this.settingType === '2' && !this.colonyValue) {
            result = {
                text: '集群不能为空',
                isPass: false
            };
        } else if (this.settingType === '4' && !this.odinValue) {
            result = {
                text: 'Odin节点不能为空',
                isPass: false
            };
        } else {
            result = await this.moreConfig.isCanSave();
        }
        return new Promise<IResultBoolean>((resolve) => {
            resolve(result);
        });
    }

    public async isCanSave2(): Promise<IResultBoolean> {
        let result = {
            text: '',
            isPass: true
        };
        if (!this.planName) {
            result = {
                text: 'Name不能为空',
                isPass: false
            };
        } else if (!this.groups) {
            result = {
                text: '分组不能为空',
                isPass: false
            };
        }
        return new Promise<IResultBoolean>((resolve) => {
            resolve(result);
        });
    }

    public async isCanSave3(): Promise<IResultBoolean> {
        let result = {
            text: '',
            isPass: true
        };
        await this.getEndpointslist();
        if (this.endpointsList.length < 1) {
            result = {
                text: 'Endpoints为空',
                isPass: false
            };
        }
        return new Promise<IResultBoolean>((resolve) => {
            resolve(result);
        });
    }

    public async isCanSave4(): Promise<IResultBoolean> {
        let result = {
            text: '',
            isPass: true
        };
        if (this.settingType === '1') {
            const reg = /^(http|https):\/\//;
            const begin = reg.test(this.url);
            if (!begin) {
                result = {
                    text: '网址必须以Http://或Https://起始',
                    isPass: false
                };
            }
        }
        if (this.settingType === '3') {
            const reg = /^\//;
            const begin = reg.test(this.url);
            if (!begin) {
                result = {
                    text: '网址必须以 / 起始',
                    isPass: false
                };
            }
        }
        if (this.moreConfig.ifNeed === true) {
            if (this.moreConfig.fileType === '1') {
                if (this.moreConfig.fileName === '') {
                    result = {
                        text: '自定义变量不能为空',
                        isPass: false
                    };
                }
            } else {
                if (this.moreConfig.ip === '') {
                    result = {
                        text: 'ip不能为空',
                        isPass: false
                    };
                } else if (this.moreConfig.path === '') {
                    result = {
                        text: '文件路径不能为空',
                        isPass: false
                    };
                }
            }
        }
        return new Promise<IResultBoolean>((resolve) => {
            resolve(result);
        });
    }

    /**
     * 保存：正式发出请求
     */
    protected async doSave(): Promise<IResultBoolean> {
        let results = {
            text: '保存成功',
            isPass: true
        };
        this.setUrlAndInfo();
        if (this.moreConfig.ifNeedFileServer === '1') {
            if (this.moreConfig.fileType === '1') {
                this.moreConfig.fileServer = {
                    fileInfo: {
                        fileName: this.moreConfig.fileName || '',
                        path: this.moreConfig.uploadPath
                    },
                    ifDefaultFileServer: 1
                };
            } else {
                this.moreConfig.fileServer = {
                    fileInfo: {
                        ip: this.moreConfig.ip,
                        path: this.moreConfig.path
                    },
                    ifDefaultFileServer: 0
                };
            }
        }
        try {
            if (this.moreConfig.isBusinessNum === false) {
                this.moreConfig.businessNum = '';
            } else {
                this.moreConfig.businessNum = this.moreConfig.businessNum || 'errno';
            }
            const ajaxParams = {
                groupNumber: parseInt(this.groups, 10), // 5,
                planName: this.planName || '', // "create_single_test",
                service: {
                    type: this.settingType,
                    info: this.info
                },
                url: this.url || '', // "http://100.69.185.15:8001/test/jmeter/createOrder",
                method: this.method, // "POST",
                body: this.isBodyDisabled ? '' : this.bodyContent, // "{\"a\":1}",
                headers: this.headers.toPlainObject(), //  {'Content-Type': "application/json;charset=UTF-8"}
                cookies: this.cookies.toPlainObject(), // {},
                more: {
                    keepAlive: this.moreConfig.isKeepLongLink, //  true,
                    timeout: this.moreConfig.timeoutSecond, //  5000,
                    maxRedirects: this.moreConfig.maxRedirect, //  0,
                    ifNeedFileServer: Number(this.moreConfig.ifNeedFileServer),
                    fileServer: this.moreConfig.fileServer,
                    ifUseBusinessCode: this.moreConfig.isBusinessNum,
                    businessCode: this.moreConfig.businessNum
                }
            };
            const headerParams = {
                business: this.groups
            };
            if (this.planId) {
                await updataConfigHS(ajaxParams, { planId: this.planId });
            } else {
                const respData = await createConfigHttpSingle(ajaxParams, headerParams);
                runInAction(() => {
                    this.planId = String(respData.planId);
                });
            }
        } catch (ex) {
            results = {
                text: '保存失败',
                isPass: false
            };
            this.showUrl();
        }

        return new Promise<IResultBoolean>((resolve) => {
            resolve(results);
        });
    }

    @action
    public setUrl(val: string) {
        this.url = val;
    }

    @action
    public setColonyValue(val: string) {
        this.colonyValue = val;
    }

    @action
    public setOdinValue(val: string) {
        this.odinValue = val;
    }

    @action
    public setOdinPort(val: string) {
        this.odinPortValue = val;
    }

    @action
    public setBodyContent(val: string) {
        this.bodyContent = val;
    }

    @action
    public setTimeoutSecond(val: number) {
        this.moreConfig.timeoutSecond = val;
    }

    @action
    public setIsKeepLongLink(val: boolean) {
        this.moreConfig.isKeepLongLink = val;
    }

    @action
    public setIsAllowRedirect(val: boolean) {
        this.moreConfig.isAllowRedirect = val;
        if (val) {
            this.moreConfig.maxRedirect = this.maxRedirectPre;
        } else {
            this.maxRedirectPre = this.moreConfig.maxRedirect;
            this.moreConfig.maxRedirect = 0;
        }
    }

    @action
    public setMaxRedirect(val: number) {
        this.moreConfig.maxRedirect = val;
    }

    @action
    public setIsHasCustomized(val: boolean) {
        this.moreConfig.isHasCustomizedIndexErrno = val;
    }

    @action
    public setPlanName(val: string) {
        this.planName = val;
    }

    @action
    public setMethod(val: string) {
        this.method = val;
        if (!this.isBodyDisabled) {
            this.setBodyType('urlencoded');
        }
    }

    @action
    public setColonyMethod(val: string) {
        this.colonyMethod = val;
    }

    @action
    public setOdinMethod(val: string) {
        this.odinMethod = val;
    }

    @action
    public setGroups(val: string) {
        this.groups = val;
    }

    @action
    public changeSettingType(val: string) {
        this.settingType = val;
        if (val === '1') {
            this.url = 'http://';
        } else if (val === '2') {
            this.url = '';
        } else if (val === '3') {
            this.url = '';
        } else {
            this.url = '';
        }
        this.setPlaceHolder();
    }

    @action
    public changeDiSFValue(val: string) {
        this.DiSFValue = val;
    }

    @action
    public setUrlAndInfo() {
        this.tempUrl = this.url;
        if (this.settingType === '1') {
            const index = this.url.indexOf('\/\/');
            const str2 = this.url.substring(index + 2);
            const index2 = str2.indexOf('\/');
            if (index2 < 0) {
                this.info = this.url;
                this.url = '/';
            } else {
                const url = str2.substring(index2);
                const info = this.url.replace(str2.substring(index2), '');
                this.url = url;
                this.info = info;
            }
        } else if (this.settingType === '3') {
            this.info = this.DiSFValue;
        } else if (this.settingType === '2') {
            const data = this.colonyValue.split(',');
            const arr: any = [];
            data.forEach((item) => {
                const obj: any = {};
                obj.host = item.split(':')[0];
                obj.port = Number(item.split(':')[1]);
                arr.push(obj);
            });
            const obj2: any = {};
            obj2.protocol = this.colonyMethod;
            obj2.nodes = arr;
            this.info = JSON.stringify(obj2);
        } else {
            this.info = this.odinMethod + '://' + this.odinValue + ':' + this.odinPortValue;
        }
    }

    @action
    private showUrl() {
        if (this.settingType === '1' && this.url.length > 1) {
            this.tempUrl = this.info + this.url;
            this.setUrl(this.tempUrl);
        }
        if (this.settingType === '1' && this.url === '/') {
            this.url = this.info;
        }
    }

    @action
    private setEndpointsList(val) {
        this.endpointsList = val;
    }

    public async getEndpointslist() {
        try {
            const ajaxParams = {
                cuuid: this.DiSFValue
            };
            const respData = await getEndpointsList(ajaxParams);
            this.endpointsList = respData;
        } catch (e) {
        }
    }

    public async getNumberInput() {
        let varFile: string = '';
        let isDefaultFileServer: boolean = true;
        if (this.moreConfig.fileType === '1') {
            varFile = this.moreConfig.uploadPath;
        } else {
            varFile = this.moreConfig.path;
        }
        if (this.moreConfig.fileType === '1') {
            isDefaultFileServer = true;
        } else {
            isDefaultFileServer = false;
        }
        try {
            const ajaxParams = {
                ifDefaultFileServer: isDefaultFileServer,
                host: this.moreConfig.ip,
                filePath: varFile,
                lineNumber: this.moreConfig.numberInput || '1'
            };
            const resData = await getFileContent(ajaxParams);
            if ( resData.length > 0 ) {
                this.moreConfig.fileContentArr = resData as any;
            }
        } catch (e) {}
    }

    @action
    public initValue() {
        const settingType = Number(this.settingType);
        if (settingType === 3) {
            this.DiSFValue = this.info.replace('disf!', '');
        } else if (settingType === 2) {
            const data = JSON.parse(this.info).nodes;
            const arr: any = [];
            data.forEach((item) => {
                arr.push(item.host + ':' + item.port);
            });
            this.colonyValue = arr.join(',');
            this.colonyMethod = JSON.parse(this.info).protocol.toUpperCase();
        } else if (settingType === 4) {
            this.odinMethod = this.info.split('://')[0].toUpperCase();
            this.odinValue = this.info.split('://')[1].split(':')[0];
            this.odinPortValue = this.info.split('://')[1].split(':')[1];
        }
    }

    private setPlaceHolder() {
        switch (this.settingType) {
            case '1':
                return this.placeHolder = '请输入HTTP请求URL，例：http://192.168.0.1:8080/get?a=1';
            case '2':
                return this.placeHolder = '请输入HTTP请求URL，例：/test?a=2';
            case '3':
                return this.placeHolder = '请输入HTTP请求URL，例：/test?a=1';
            case '4':
                return this.placeHolder = '请输入HTTP请求URL，例：/test?a=4';
            default:
                return this.placeHolder = '';
        }
    }

    @action
    public setFileName(val: string) {
        this.moreConfig.fileName = val;
    }

    @action
    public setBodyType(val: string) {
        this.bodyType = val;

        if (this.isBodyDisabled) {
            return;
        }
        const mapItem = MAP_BODY[val] || MAP_BODY.urlencoded;
        this.bodyPlaceholder = mapItem.placeholder;
        const name = 'Content-Type';
        const value = mapItem.contentType;
        const items = this.headers.findItemsByName(name);
        const empty = this.headers.findItemsByName('');
        if (items.length > 0) {
            items.forEach((it) => {
                it.updateValue(value);
            });
        } else if (empty.length > 0) {
            empty[0].updateName(name);
            empty[0].updateValue(value);
        } else {
            this.headers.add(new ModelNameValue({
                name,
                value,
                placeholderPrefix: 'Header'
            }));
        }
    }
    @action
    public setIfNeed(val): void {
        this.moreConfig.ifNeed = val;
        if (val === true) {
            this.moreConfig.ifNeedFileServer = '1';
            this.moreConfig.fileType = '1';
        } else {
            this.moreConfig.ifNeedFileServer = '0';
        }
    }
    @action
    public setFileType(val): void {
        this.moreConfig.fileType = val;
    }
    @action
    public setIp(val): void {
        this.moreConfig.ip = val;
    }
    @action
    public setPath(val): void {
        this.moreConfig.path = val;
    }
    @action
    public setFileNames(val: string) {
        this.bodyContent = val;
    }
    @action
    public numberInput(): void {
        this.getNumberInput();
    }
    @action
    public setNumberInput(val): void {
        this.moreConfig.numberInput = val;
    }
    @action
    public setIsBusinessNum(val): void {
        this.moreConfig.isBusinessNum = val;
    }
    @action
    public setBusinessNum(val): void {
        this.moreConfig.businessNum = val;
    }

    @computed
    public get vBody(): any {
        if (this.bodyContent) {
            return this.bodyContent;
        } else {
            return '暂无内容';
        }
    }

    @computed
    public get vHeaders(): string {
        return this.headers.toString();
    }

    @computed
    public get vCookies(): string {
        return this.cookies.toString();
    }

    @computed
    public get vIsDisabledWhenEdit(): any {
        return !!this.planId;
    }
}
