import { IIsCanSave } from 'com/didichuxing/commonInterface/IIsCanSave';
import { IResultBoolean } from 'com/didichuxing/commonInterface/IResultBoolean';
import AModelTestConfig from 'com/didichuxing/ultron/business/modelTestConfig/models/AConfig';
import ModelNameTypeValueList from 'com/didichuxing/ultron/components/modelNameTypeValue/models/ModelNameTypeValueList';
import ModelNameTypeValue from 'com/didichuxing/ultron/components/modelNameTypeValue/models/ModelNameTypeValue';
import {createConfigThrift, getPressureDetailsThrift, updataConfigThrift} from '@ultron/remote/testConfig';
import {observable, action, runInAction, computed} from 'mobx';
import {ETestConfigType, textTestConfigType} from '@ultron/business/common/enum/ETestConfigType';
import { getFileContent } from '@ultron/remote/common';

/**
 * Thrift更多配置业务模型
 */
class ConfigThriftMore implements IIsCanSave {
    @observable public timeoutSecond: number = 10000;
    @observable public ifMulti: boolean = false;
    @observable public serviceName: string = '';
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
    @observable public isSeeButton: boolean = true;

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
            if (this.timeoutSecond < 1 || this.timeoutSecond > 12000) {
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
 * Thrift测试配置业务模型
 */
export default class ModelTestConfigThrift extends AModelTestConfig {
    @observable public planId?: string = '';
    public readonly type = ETestConfigType.Thrift;
    @observable public protocolType: string = '0';
    @observable public ipList: string = '';
    @observable public port: number = 8090;
    @observable public idl: string = '';
    @observable public idlName: string = '';
    @observable public idlPath: any = '';
    @observable public service: string = '';
    @observable public method: string = '';
    @observable public planName?: any = '';
    @observable public groups: string = '15'; // 此处下拉是获取接口的数据
    @observable public isShow: boolean = false;
    @observable public isShows: boolean = false;
    @observable public parameterConfigs: ModelNameTypeValueList = new ModelNameTypeValueList();
    @observable public isSeeButtons: boolean = true;
    public moreConfig = new ConfigThriftMore();

    @observable public parameters: ModelNameTypeValueList;

    constructor(planId?: string, planName?: any, cloneId?: string) {
        super();
        this.parameters = new ModelNameTypeValueList();
        if (planId) {
            this.initByPlanId(planId, planName);
        } else if (cloneId) {
            this.initByPlanId(cloneId);
        } else {
            this.parameters.add(new ModelNameTypeValue({
                placeholderPrefix: ''
            }));
        }
    }

    /**
     * http单接口查看，请求接口数据再进行赋值
     * @param planId
     * @returns {Promise<void>}
     */
    private async initByPlanId(planId: string, planName?: string): Promise<void> {
        const respData = await getPressureDetailsThrift({ planId: planId });
        runInAction(() => {
            if (planName) {
                this.planId = planId;
                this.planName = respData.planName;
            } else {
                this.planName = '';
            }
            this.protocolType = String(respData.protocol.type);
            this.method = respData.method;
            this.groups = String(respData.groupNumber);
            this.service = respData.service;
            this.idlPath = respData.idl;
            this.idlName = respData.idlName;
            this.ipList = respData.server.ipList.join(',');
            this.port = respData.server.port;
            this.parameterConfigs.clear();
            this.moreConfig.timeoutSecond = respData.timeout;
            this.moreConfig.ifMulti = respData.ifMulti;
            this.moreConfig.serviceName = respData.serviceName;
            this.moreConfig.fileType = String(respData.ifDefaultFileServer);
            if (respData.parameterConfigs.length < 1) {
                // this.parameterConfigs.add
            } else {
                const  configs = respData.parameterConfigs;
                configs.forEach((it) => {
                    this.parameterConfigs.add(new ModelNameTypeValue({
                        name: it.name,
                        type: it.type.toString(),
                        value: it.value
                    }));
                });
            }
            if (
                this.moreConfig.fileType !== '0' &&
                this.moreConfig.fileType !== '1') {
                this.moreConfig.ifNeed = false;
                this.moreConfig.ifNeedFileServer = '0';
            } else {
                this.moreConfig.ifNeed = true;
                this.moreConfig.ifNeedFileServer = '1';
                this.moreConfig.fileType = String(respData.ifDefaultFileServer);
                if (this.moreConfig.fileType === '1') {
                    this.moreConfig.fileName = respData.fileName;
                    this.moreConfig.uploadPath = respData.path;
                } else {
                    this.moreConfig.ip = respData.ip;
                    this.moreConfig.path = respData.path;
                }
            }
            this.parameters.fromPlainObject(respData.parameterConfigs, '');
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
        if (!this.ipList) {
            result = {
                text: 'IP不能为空',
                isPass: false
            };
        } else if (!this.idlPath) {
            result = {
                text: 'Jar文件不能为空',
                isPass: false
            };
        } else if (!this.service) {
            result = {
                text: '服务名称不能为空',
                isPass: false
            };
        } else if (!this.method) {
            result = {
                text: '方法名称不能为空',
                isPass: false
            };
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
            const ajaxParams = {
                groupNumber: parseInt(this.groups, 10), // 5,
                planName: this.planName, // "create_thrift_test_05",
                idl: this.idlPath, // "/home/xiaoju/data/111.thrift",
                service: this.service, // "demo",
                method: this.method, // "demo",
                timeout: this.moreConfig.timeoutSecond,
                fileName: this.moreConfig.fileName,
                ifMulti: this.moreConfig.ifMulti,
                serviceName: this.moreConfig.serviceName,
                parameterConfigs: this.parameters.toPlainObject(),
                // parameterConfigs: this.parameters.toPlainObject(), // [{},{},{}]
                server: {
                    ipList: this.ipList.split(','), // ["127.0.0.1"],
                    port: this.port // 8090
                },
                protocol: {
                    type: this.protocolType // 1
                },
                ifNeedFileServer: Number(this.moreConfig.ifNeedFileServer),
                fileServer: this.moreConfig.fileServer
            };
            const headerParams = {
                business: this.groups
            };

            if (this.planId) {
                await updataConfigThrift(ajaxParams, { planId: this.planId });
            } else {
                const respData = await createConfigThrift(ajaxParams, headerParams);
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
            this.moreConfig.fileContentArr = resData as any;
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
    public setMethod(val: string) {
        this.protocolType = val;
    }

    @action
    public setIp(val: string) {
        this.ipList = val;
    }

    @action
    public setPort(val: number) {
        this.port = val;
    }

    @action
    public setIdl(val: string) {
        this.idl = val;
    }

    @action
    public setServerName(val: string) {
        this.service = val;
    }

    @action
    public setMethodName(val: string) {
        this.method = val;
    }

    @action
    public setTimeoutSecond(val: number) {
        this.moreConfig.timeoutSecond = val;
    }

    @action
    public setFileName(val: string) {
        this.moreConfig.fileName = val;
    }

    @action
    public setFileNames(val: string) {
        this.idlName = val;
    }

    @action
    public setIfMulti(val: boolean) {
        this.moreConfig.ifMulti = val;
    }

    @action
    public setServerNames(val: string) {
        this.moreConfig.serviceName = val;
    }

    @action
    public setIfNeed(val): void {
        this.moreConfig.ifNeed = val;
        if (val === true) {
            this.moreConfig.ifNeedFileServer = '1';
        } else {
            this.moreConfig.ifNeedFileServer = '0';
        }
    }
    @action
    public setFileType(val): void {
        this.moreConfig.fileType = val;
    }
    @action
    public setIps(val): void {
        this.moreConfig.ip = val;
    }
    @action
    public setPath(val): void {
        this.moreConfig.path = val;
    }

    @action
    public numberInput(): void {
        this.getNumberInput();
    }
    @action
    public setNumberInput(val): void {
        this.moreConfig.numberInput = val;
    }
    @computed
    public get vProtocolType(): string {
        if (this.protocolType === '0') {
            return 'TBinaryProtocol';
        } else if (this.protocolType === '1') {
            return 'TCompactProtocol';
        } else if (this.protocolType === '2') {
            return 'TSimpleJsonProtocol';
        } else if (this.protocolType === '3') {
            return 'TJsonProtocol';
        } else {
            return 'TTupleProtocol';
        }
    }

    @computed
    public get vIsDisabledWhenEdit(): any {
        return !!this.planId;
    }
}
