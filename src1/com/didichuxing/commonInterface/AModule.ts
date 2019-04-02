import React from 'react';
import { RouteComponentProps } from 'react-router';
import { IPlainObject } from 'com/didichuxing/IPlainObject';
import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';

export interface IViewProps extends RouteComponentProps<any> {
    [index: string]: any;
}

interface IUrlObj {
    pathname: string;
    search: string;
}

interface IHistoryObj {
    url?: string;
    query?: IPlainObject;
}

export abstract class AModule<T extends AModuleModel> extends React.Component<IViewProps, any> {
    /**
     * 当前 View 的 model
     */
    protected model: T;
    protected pathname: any;
    protected query: any;

    constructor(props, context) {
        super(props, context);

        this.pathname = props.location.pathname;
        this.query = props.query;
        this.model = this.createModel();
    }

    /**
     * 创建当前 View 的 model
     * @returns {T}
     */
    protected abstract createModel(): T;

    /**
     * url（支持 pathname 和 search，如'/xxx/yy?a=b'）
     * @param {string} url
     */
    private getUrlObj(url?: string, params?: IPlainObject): IUrlObj {
        const urlArr = (url || this.pathname).split('?');
        let search = '?' + (urlArr.length > 1 ? urlArr[1] : '');

        const newParams = url ? params : this.model.getQueryState();

        if (newParams) {
            if (search[search.length - 1] !== '?') {
                search += '&';
            }
            search += Object.keys(newParams).map((key) => key + '=' + newParams[key]).join('&');
        }
        return {
            pathname: (urlArr[0].indexOf('/new.html') === 0 ? '' : '/new.html') + urlArr[0],
            search: search
        };
    }

    /**
     * 路由推进一个新url
     * @param {string} url
     * @param {IPlainObject} params
     */
    protected push(p: IHistoryObj = {}): void {
        this.props.history.push(this.getUrlObj(p.url, p.query));
    }

    /**
     * 路由替换一个新url
     * @param {string} url
     * @param {IPlainObject} params
     */
    protected replace(p: IHistoryObj = {}): void {
        this.props.history.replace(this.getUrlObj(p.url, p.query));
    }

    /**
     * 路由回退一步
     */
    protected goBack(): void {
        this.props.history.goBack();
    }

    /**
     * 路由前进一步
     */
    protected goForward(): void {
        this.props.history.goForward();
    }

    /**
     * 路由前进/回退 n 步
     */
    protected go(n: number): void {
        this.props.history.go(n);
    }
}
