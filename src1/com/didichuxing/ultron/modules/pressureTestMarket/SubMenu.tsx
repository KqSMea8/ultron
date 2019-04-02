import React from 'react';
import { Bind } from 'lodash-decorators';
import Icon from '@antd/icon';
import Menu from '@antd/menu';
import {AModule} from 'com/didichuxing/commonInterface/AModule';

export interface IViewProps {
    pushTo(k: string): void;
    [index: string]: any;
}

class SubMenu extends React.Component<IViewProps, any> {
    constructor(props: IViewProps, context) {
        super(props, context);
    }
    private get defaultKeys() {
        let defaultKey = location.pathname.replace('/new.html', '');
        if (defaultKey === '/ultron/capacity') {
            defaultKey = '/ultron/capacity/business';
        }
        return [defaultKey];
    }

    @Bind()
    private onClickMenu({ item, key, selectedKeys }: any) {
        this.props.pushTo(key);
    }

    public render(): React.ReactNode {
        return (
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={ this.defaultKeys }
                onClick={ this.onClickMenu }
            >
                <Menu.Item key="/ultron/capacity/business">
                    <Icon type="qrcode" />
                    <span>业务容量</span>
                </Menu.Item>
                <Menu.Item key="/ultron/capacity/service">
                    <Icon type="qrcode" />
                    <span>服务容量</span>
                </Menu.Item>
            </Menu>
        );
    }
}

export default SubMenu;
