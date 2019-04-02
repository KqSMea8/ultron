import { IIsCanSave } from 'com/didichuxing/commonInterface/IIsCanSave';
import { IResultBoolean } from 'com/didichuxing/commonInterface/IResultBoolean';
import AModelTestConfig from 'com/didichuxing/ultron/business/modelTestConfig/models/AConfig';
import ModelNameValueList from 'com/didichuxing/ultron/components/modelNameValue/models/ModelNameValueList';
import ModelNameValue from 'com/didichuxing/ultron/components/modelNameValue/models/ModelNameValue';
import {
    createConfigHttpMulti, createConfigScene, getPressureDetailsHM, updataConfigHM
} from '@ultron/remote/testConfig';
import { getFileContent } from '@ultron/remote/common';
import { observable, action, runInAction, computed } from 'mobx';
import { ETestConfigType } from '@ultron/business/common/enum/ETestConfigType';

/**
 * http多接口更多配置业务模型
 */
class ConfigMultiHttpMore implements IIsCanSave {
    @observable public timeoutSecond: number = 10000;
    @observable public isKeepLongLink: boolean = true;
    @observable public isAllowRedirect: boolean = true;
    @observable public maxRedirect: number = 10;
    @observable public isHasCustomizedVar: boolean = false;
    @observable public customizedVar: string = '';
    @observable public isHasCustomizedIndexErrno: boolean = false;
    @observable public isBusinessNum: boolean = false;
    @observable public businessNum: string = 'errno';

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
                        text: '允许重定向次数的范围应该在1-10之间',
                        isPass: false
                    };
                }
            } else if (this.timeoutSecond < 1 || this.timeoutSecond > 12000) {
                result = {
                    text: '超时时间取值范围应该在1-12000毫秒之间',
                    isPass: false
                };
            }
            resolve(result);
        });
    }
}

/**
 * http多接口HTTP日志配置业务模型
 */
class ConfigMultiHttpLog implements IIsCanSave {
    @observable public logFile: boolean = true;
    public manualInput: boolean = false;
    @observable public requestLog: string[] = [];
    @observable public defaultService: boolean = true;
    @observable public isDefaultService: string = '11';
    public custom: boolean = false;
    @observable public customInput: string = '';
    @observable public urlPrefix: any = [];
    @observable public fileName: string = '';
    @observable public uploadPath: any = '';
    @observable public customFilePath: string = '';
    @observable public numberInput: string = '';
    @observable public fileContentArr: any[] = [];
    @observable public fileData: any = '';
    @observable public isSeeButton: boolean = true;

    @action
    public setFileName(val: string) {
        this.fileName = val;
    }

    @computed
    public get vRequestLog(): string {
        return this.requestLog.join('\n');
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
            if (this.isDefaultService === '11') {
                if (this.defaultService) {
                    if (this.uploadPath === '') {
                        result = {
                            text: '文件路径不能为空',
                            isPass: false
                        };
                    }
                } else if (this.custom) {
                    /**
                     * 需要确认自定义被选中时文件路径是否为可以为空
                     */
                    if (this.customInput === '') {
                        result = {
                            text: '自定义路径不能为空',
                            isPass: false
                        };
                    }
                }
            } else {
                if (this.requestLog.length === 0) {
                    result = {
                        text: '请求日志不能为空',
                        isPass: false
                    };
                }
            }
            resolve(result);
        });
    }
}

/**
 * Http多接口测试配置业务模型
 */
export default class ModelTestConfigMultiHttp extends AModelTestConfig {
    @observable public planId: string = '';
    public readonly type = ETestConfigType.HttpMulti;
    public httpLog = new ConfigMultiHttpLog();
    public headers: ModelNameValueList;
    public cookies: ModelNameValueList;
    public moreConfig = new ConfigMultiHttpMore();
    @observable public planName: any = '';
    @observable public groups: string = '15';
    @observable public CustomOrDefault: string = '1';
    @observable public smallTabKey: string = '11';
    @observable public isShow: boolean = false;

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
    }

    /**
     * http多接口查看，请求接口数据再进行赋值
     * @param planId
     * @returns {Promise<void>}
     */
    private async initByPlanId(planId: string, planName?: string): Promise<void> {
        const respData = await getPressureDetailsHM({ planId: planId });
        runInAction(() => {
            if (planName) {
                this.planId = planId;
                this.planName = respData.planName;
            } else {
                this.planName = '';
            }
            this.httpLog.fileName = respData.fileName;
            this.groups = String(respData.groupNumber);
            this.httpLog.fileData = respData.filePath;
            this.httpLog.customInput = respData.serverAddress;
            this.httpLog.urlPrefix = respData.urlPrefix;
            this.httpLog.defaultService = respData.ifDefaultServerAddress;
            this.moreConfig.businessNum = respData.more.businessCode;
            if (this.moreConfig.businessNum !== '') {
                this.moreConfig.isBusinessNum = true;
            } else {
                this.moreConfig.isBusinessNum = false;
            }
            if (respData.contents) {
                this.httpLog.requestLog = JSON.parse(respData.contents) as string[];
            }
            this.moreConfig.timeoutSecond = respData.more.timeout;
            this.moreConfig.isKeepLongLink = respData.more.keepAlive;
            this.moreConfig.maxRedirect = respData.more.maxRedirects;
            // this.moreConfig.isAllowRedirect = respData.more.
            this.headers.fromPlainObject(respData.headers, 'Header');
            this.cookies.fromPlainObject(respData.cookies || {}, 'Cookie');

            if (this.moreConfig.maxRedirect < 1) {
                this.moreConfig.isAllowRedirect = false;
            }
            if (this.httpLog.defaultService === false) {
                this.httpLog.customFilePath = this.httpLog.fileData;
            } else {
                this.httpLog.uploadPath = this.httpLog.fileData;
            }

            if (this.httpLog.uploadPath) {
                this.smallTabKey = '11';
            } else if (this.httpLog.requestLog.length > 0) {
                this.smallTabKey = '22';
            } else {
                this.smallTabKey = '11';
            }

            if (this.httpLog.defaultService) {
                this.CustomOrDefault = '1';
                this.httpLog.customInput = '';
            } else {
                this.CustomOrDefault = '2';
            }
        });
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
        return new Promise<IResultBoolean>((resolve) => {
            resolve(result);
        });
    }

    public async isCanSave1(): Promise<IResultBoolean> {
        let result = {
            text: '',
            isPass: true
        };
        result = await this.httpLog.isCanSave();
        if (result.isPass) {
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

    /**
     * 保存：正式发出请求
     */
    protected async doSave(): Promise<IResultBoolean> {
        let results = {
            text: '保存成功',
            isPass: true
        };
        let path: any = '';
        if (this.CustomOrDefault === '1') {
            path = this.httpLog.uploadPath;
        } else {
            path = this.httpLog.customFilePath;
        }
        try {
            if (this.moreConfig.isBusinessNum === false) {
                this.moreConfig.businessNum = '';
            } else {
                this.moreConfig.businessNum = this.moreConfig.businessNum || 'errno';
            }
            const ajaxParams = {
                groupNumber: parseInt(this.groups, 10), // 4,
                planName: this.planName, // "create_replay_test",
                urlPrefix: this.httpLog.urlPrefix, // []
                headers: this.headers.toPlainObject(),
                filePath: path, // "/home/xiaoju/webroot/pressure-platform/result/.txt"
                serverAddress: this.httpLog.customInput, // "thrift://100.69.111.43:8009?timeout=50000"
                planId: this.planId, // 307
                contents: this.httpLog.requestLog,
                createUser: '', // ""
                cookies: this.cookies.toPlainObject(), // ,
                ifDefaultServerAddress: this.httpLog.defaultService, // true
                more: {
                    keepAlive: this.moreConfig.isKeepLongLink, //  true,
                    timeout: this.moreConfig.timeoutSecond, //  5000,
                    maxRedirects: this.moreConfig.maxRedirect, //  0,
                    ifUseBusinessCode: this.moreConfig.isBusinessNum,
                    businessCode: this.moreConfig.businessNum
                },
                fileName: this.httpLog.fileName
            };
            const headerParams = {
                business: this.groups
            };

            if (this.planId) {
                await updataConfigHM(ajaxParams, { planId: this.planId });
            } else {
                const respData = await createConfigHttpMulti(ajaxParams, headerParams);
                runInAction(() => {
                    this.planId = String(respData.planId);
                });
            }
        } catch (ex) {
            results = {
                text: '保存失败',
                isPass: false
            };
        }

        return new Promise<IResultBoolean>((resolve) => {
            resolve(results);
        });
    }

    public async getNumberInput() {
        let varFile: string = '';
        let isDefaultFileServer: boolean = true;
        if (this.CustomOrDefault === '1') {
            varFile = this.httpLog.uploadPath;
        } else {
            varFile = this.httpLog.customFilePath;
        }
        if (this.CustomOrDefault === '1') {
            isDefaultFileServer = true;
        } else {
            isDefaultFileServer = false;
        }
        try {
            const ajaxParams = {
                ifDefaultFileServer: isDefaultFileServer,
                host: this.httpLog.customInput,
                filePath: varFile,
                lineNumber: this.httpLog.numberInput || '1'
            };
            const resData = await getFileContent(ajaxParams);
            if (resData.length > 0) {
                this.httpLog.fileContentArr = resData as any;
            }
        } catch (e) {}
    }

    @action
    public setServiceType(val: string) {
        this.CustomOrDefault = val;
        if (val === '2') {
            this.httpLog.defaultService = false;
        } else {
            this.httpLog.defaultService = true;
        }
    }

    @action
    public setUrlPrefix(val: any) {
        if (val === '') {
            this.httpLog.urlPrefix = [];
        } else {
            this.httpLog.urlPrefix = val.split(',');
        }
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
    public setPlanName(val: string) {
        this.planName = val;
    }

    @action
    public setGroups(val: string) {
        this.groups = val;
    }

    @action
    public setRequestLog(val: string) {
        if (val === '') {
            this.httpLog.requestLog = [];
        } else {
            this.httpLog.requestLog = val.split('\n');
        }
    }

    @action
    public setCustomInput(val: string) {
        this.httpLog.customInput = val;
    }

    @action
    public setDfaultService(val: string) {
        this.httpLog.isDefaultService = val;
        if (val === '11') {
            this.httpLog.requestLog = [];
        } else if (val === '22') {
            this.httpLog.uploadPath = '';
            this.httpLog.customInput = '';
        }
    }
    @action
    public setCustomFilePath(val): void {
        this.httpLog.customFilePath = val;
    }

    @action
    public numberInput(): void {
        this.getNumberInput();
    }
    @action
    public setNumberInput(val): void {
        this.httpLog.numberInput = val;
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

    @computed
    public get vQ(): any {
        return String(this.httpLog.defaultService);
    }

    @computed
    public get vSmallTabKey(): string {
        return this.smallTabKey;
    }

    @action.bound
    public setSmallTabKey(val: string): void {
        this.smallTabKey = val;
        this.httpLog.isDefaultService = val;
        if (val === '11') {
            this.httpLog.requestLog = [];
        } else if (val === '22') {
            this.httpLog.uploadPath = '';
            this.httpLog.customInput = '';
        }
    }
}
