import { IIsCanSave } from 'com/didichuxing/commonInterface/IIsCanSave';
import { IResultBoolean } from 'com/didichuxing/commonInterface/IResultBoolean';
import AModelTestConfig from 'com/didichuxing/ultron/business/modelTestConfig/models/AConfig';
import {
    createConfigHttpSingle, createConfigScene, getPressureDetailsScene, updataConfigScene
} from '@ultron/remote/testConfig';
import {observable, action, runInAction, computed} from 'mobx';
import { ETestConfigType } from '@ultron/business/common/enum/ETestConfigType';
import { getFileContent } from '@ultron/remote/common';

/**
 * 场景压测更多配置业务模型
 */
class ConfigScenesHttpMore implements IIsCanSave {
    @observable public timeoutSecond: number = 10000;
    @observable public isKeepLongLink: boolean = true;
    @observable public isAllowRedirect: boolean = true;
    @observable public maxRedirect: number = 10;
    @observable public isHasCustomizedVar: boolean = false;
    @observable public customizedVar?: any;
    @observable public isHasCustomizedIndexErrno: boolean = false;
    @observable public fileName: string = '';
    @observable public ifNeed: boolean = false;
    @observable public ifNeedFileServer: string = '';
    @observable public fileType: string = '1';
    @observable public fileServer: any = null;
    @observable public ip: string = '';
    @observable public path: string = '';
    @observable public uploadPath: string = '';
    @observable public numberInput: string = '';
    @observable public fileContentArr: any[] = [];
    @observable public isSeeButton: boolean = true;
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
                        text: '允许重定向次数的范围应该在1-10之间',
                        isPass: false
                    };
                }
            } else if (this.timeoutSecond < 1 || this.timeoutSecond > 12000) {
                result = {
                    text: '超时时间取值范围应该在1-12000毫秒之间',
                    isPass: false
                };
            } else if (this.isHasCustomizedVar) {
                if (this.customizedVar === '') {
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
 * 场景压测测试配置业务模型
 */
export default class ModelTestConfigSceneHttp extends AModelTestConfig {
    private maxRedirectPre = 10;
    @observable public planId: string = '';
    public readonly type = ETestConfigType.HttpScene;
    @observable public pressureScript: string = '';
    public moreConfig = new ConfigScenesHttpMore();
    @observable public groups: string = '15';
    @observable public planName?: any = '';
    @observable public isShow: boolean = false;
    @observable public getList: any[] = [''];
    @observable public index: any = 0;
    @observable public paramsList: any = [];
    @observable public paramsLists: any = [''];
    @observable public isShowss: boolean = false;
    @observable public pressureMode: number = 0;
    constructor(planId?: string, planName?: any, cloneId?: string) {
        super();
        if (planId) {
            this.initByPlanId(planId, planName);
        } else if (cloneId) {
            this.initByPlanId(cloneId);
        }
    }

    public getPath(val): void {
        this.getList.splice(this.index, 1, val);
    }
    public paramsData(val): void {
        this.paramsLists.splice(this.index, 1, val);
    }
    /**
     * 场景压测查看，请求接口数据再进行赋值
     * @param planId
     * @returns {Promise<void>}
     */
    private async initByPlanId(planId: string, planName?: any): Promise<void> {
        const respData = await getPressureDetailsScene({ planId: planId });

        runInAction(() => {
            if (planName) {
                this.planId = planId;
                this.planName = planName || respData.planName;
            } else {
                this.planName = '';
            }
            this.groups = String(respData.groupNumber);
            this.pressureScript = JSON.parse(respData.contents).join('\n');
            this.moreConfig.timeoutSecond = respData.more.timeout;
            this.moreConfig.isKeepLongLink = respData.more.keepAlive;
            this.moreConfig.maxRedirect = respData.more.maxRedirects;
            this.moreConfig.fileType = String(respData.more.ifDefaultFileServer);
            this.moreConfig.businessNum = respData.more.businessCode;
            this.pressureMode = respData.pressureMode;
            if (this.moreConfig.businessNum !== '') {
                this.moreConfig.isBusinessNum = true;
            } else {
                this.moreConfig.isBusinessNum = false;
            }
            respData.more.interfaceFilePaths.map((item) => {
                this.getList.push(item.name);
                this.paramsLists.push(item.path);
            });
            if (this.getList.length > 1) {
                this.getList.splice(0, 1);
                this.paramsLists.splice(0, 1);
            }
            if (this.moreConfig.maxRedirect < 1) {
                this.moreConfig.isAllowRedirect = false;
            }
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
        if (!this.pressureScript) {
            result = {
                text: '压测脚本不能为空',
                isPass: false
            };
        } else {
            result = await this.moreConfig.isCanSave();
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
    public async isCanSave2(): Promise<IResultBoolean> {
        let result = {
            text: '',
            isPass: true
        };
        if (this.planName === '') {
            result = {
                text: 'Name不能为空',
                isPass: false
            };
        } else if (this.groups === '') {
            result = {
                text: '分组不能为空',
                isPass: false
            };
        }
        return new Promise<IResultBoolean>((resolve) => {
            resolve(result);
        });
    }
    protected async doSave(): Promise<IResultBoolean> {
        let results = {
            text: '保存成功',
            isPass: true
        };
        this.paramsLists.map((item) => {
            if (item !== '') {
                this.paramsList.push(item);
            }
        });
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
                groupNumber: parseInt(this.groups, 10), // 4,
                planName: this.planName || '', // "create_test_scene",
                contents: JSON.stringify(this.pressureScript.split('\n')), // jeter/createOrder||||||"]
                more: {
                    keepAlive: this.moreConfig.isKeepLongLink, //  true,
                    timeout: this.moreConfig.timeoutSecond, //  5000,
                    maxRedirects: this.moreConfig.maxRedirect, //  0,
                    ifNeedFileServer: Number(this.moreConfig.ifNeedFileServer),
                    fileServer: this.moreConfig.fileServer,
                    interfaceFilePaths: this.paramsList,
                    ifUseBusinessCode: this.moreConfig.isBusinessNum,
                    businessCode: this.moreConfig.businessNum
                }
            };
            const headerParams = {
                business: this.groups
            };

            if (this.planId) {
                await updataConfigScene(ajaxParams, { planId: this.planId });
            } else {
                const respData = await createConfigScene(ajaxParams, headerParams);
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
            if (resData.length > 0) {
                this.moreConfig.fileContentArr = resData as any;
            }
        } catch (e) {}
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
    public setPressureScript(val: string) {
        this.pressureScript = val;
    }

    @action
    public setFileName(val: string) {
        this.moreConfig.fileName = val;
    }

    /**
     * 选择是否需要文件服务
     * @param val
     */
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

    /**
     * 设置文件类型
     * @param val
     */
    @action
    public setFileType(val): void {
        this.moreConfig.fileType = val;
    }

    /**
     * 设置IP
     * @param val
     */
    @action
    public setIp(val): void {
        this.moreConfig.ip = val;
    }

    /**
     * 设置文件路径
     * @param val
     */
    @action
    public setPath(val): void {
        this.moreConfig.path = val;
    }

    @action
    public numberInput(): void {
        this.getNumberInput();
    }
    @action
    public setIsBusinessNum(val): void {
        this.moreConfig.isBusinessNum = val;
    }
    @action
    public setBusinessNum(val): void {
        this.moreConfig.businessNum = val;
    }

    @action
    public setNumberInput(val): void {
        this.moreConfig.numberInput = val;
    }

    @computed
    public get vIsDisabledWhenEdit(): any {
        return !!this.planId;
    }
}
