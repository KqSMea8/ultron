import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';
import { observable, action, runInAction, computed } from 'mobx';
import * as ISearch from '@ultron/remote/tool/interfaces/ISearch';
import { getSearch, downLoad } from '@ultron/remote/tool';
import message from '@antd/message';
export interface ICreateWorkOrderQuery {
}

export default class ModelJarDownload extends AModuleModel implements ICreateWorkOrderQuery {
    @observable public fileName: string = '';
    @observable public uploadPath: any = '';
    @observable public isShow: boolean = false;

    constructor(query?: ICreateWorkOrderQuery, S?: string) {
        super();
        this.initByQueryFields(query);
    }
    protected getQueryFields(): Array<keyof ICreateWorkOrderQuery> {
        return [];
    }
    @action
    public setFileName(val: string) {
        this.fileName = val;
    }
}
