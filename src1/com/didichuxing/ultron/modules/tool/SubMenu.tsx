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
        if (defaultKey === '/ultron/tool') {
            defaultKey = '/ultron/tool/pressureUser';
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
                <Menu.Item key="/ultron/tool/pressureUser">
                    <Icon type="qrcode" style={ {marginLeft: '40px'} }/>
                    <span>压测用户</span>
                </Menu.Item>
                <Menu.Item key="/ultron/tool/geographyTool">
                    <Icon type="qrcode" style={ {marginLeft: '40px'} }/>
                    <span>地理工具</span>
                </Menu.Item>
                <Menu.Item key="/ultron/tool/orderChange">
                    <Icon type="qrcode" style={ {marginLeft: '40px'} }/>
                    <span>ID工具</span>
                </Menu.Item>
                <Menu.Item key="/ultron/tool/jarDownload">
                    <Icon type="qrcode" style={ {marginLeft: '40px'} }/>
                    <span>Jar生成器</span>
                </Menu.Item>
            </Menu>
        );
    }
}

export default SubMenu;
