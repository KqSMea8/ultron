/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The class of Workspace
 */

import React from 'react';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom';
import Layout from '@antd/layout';
import { CollapseType } from '@antd/layout/Sider';
import { SelectParam } from '@antd/menu';
import Row from '@antd/row';
import Col from '@antd/col';
import Debounce from 'lodash-decorators/debounce';
import InlineSVG from 'svg-inline-react';
import { ISiderMenuData, ISiderMenuMetadata } from 'com/didichuxing/context/IApplicationContext';
import SiderMenuBar from 'com/didichuxing/layout/SiderMenuBar';
import NormalHeader from 'com/didichuxing/layout/NormalHeader';
import ApplicationContext from 'com/didichuxing/context/ApplicationContext';
import RouteArea from 'com/didichuxing/area/RouteArea';
import style from 'com/didichuxing/ria/Workspace.less';
import { getCircles } from '@ultron/remote/common';
import message from '@antd/message';

import Icon from '@antd/icon';

interface IWorkspaceProps extends RouteComponentProps<{}> {}
interface IWorkspaceState {
    collapsed: boolean;
    header: React.ReactNode;
    clientHeight: number;
    timers: any;
    messages: string;
}

const SIDER_WIDTH: number = 220;

export default class Workspace extends React.Component<IWorkspaceProps, IWorkspaceState> {

    /**
     * @constructor
     * @param {IWorkspaceProps} props
     * @param context
     */
    constructor(props: IWorkspaceProps, context?: any) {
        super(props);
        this.state = {
            collapsed: false,
            header: React.createElement(NormalHeader, {}),
            clientHeight: 0,
            timers: null,
            messages: ''
        };
        this.handleMenuCollapse = this.handleMenuCollapse.bind(this);
        this.handleSelectMenuItem = this.handleSelectMenuItem.bind(this);
    }

    /**
     * 收缩左侧栏菜单
     * @param {React.MouseEvent<any>} event
     */
    private handleMenuCollapse(collapsed: boolean, type: CollapseType): void {
        this.setState({
            collapsed: collapsed
        });
    }

    /**
     * 选择菜单项。
     * @param {SelectParam} param
     */
    private handleSelectMenuItem(param: SelectParam): void {
        this.props.history.push(param.selectedKeys[0]);
    }

    /**
     * 触发窗口resize事件。
     */
    @Debounce(600)
    private triggerResizeEvent(): void {
        const event: Event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
    }

    /**
     * @override
     * @inheritDoc
     * @returns {React.ReactNode}
     */
    public componentWillMount() {
        const clientHeight: any = document.documentElement;
        this.setState({
            clientHeight: clientHeight['clientHeight'] - 50 - 64
        });
    }
    public componentDidMount(): void {
        this.getAlert();
    }
    public componentWillUnmount() {
        if (this.state.timers) {
            clearInterval(this.state.timers);
        }
    }
    public async getAlert(): Promise<void> {
        try {
            const result = await getCircles({});
            if (result) {
                if (result.messages && result.messages.messages) {
                    // this.messages = result.messages.messages;
                    this.setState({
                        messages: result.messages.messages
                    });
                } else {
                    // this.messages = '';
                    this.setState({
                        messages: ''
                    });
                }
                if (result.alert && result.alert.length > 0) {
                    result.alert.map((item) => {
                        message.warning(item.taskId + item.msg);
                    });
                }
            }
            if (!this.state.timers) {
                this.setState({
                    timers: setInterval(() => {
                        this.getAlert();
                    }, 10000)
                });
                // timers = setInterval(() => {
                //     this.getAlert();
                // }, 10000);
            }
        } catch (e) {}
    }
    public render(): React.ReactNode {
        const path: string = this.props.location.pathname;
        let siderWidth: number = 0;
        if (!ApplicationContext.context.menuMode || ApplicationContext.context.menuMode === 'inline') {
            siderWidth = SIDER_WIDTH;
        }
        return (
            <Layout className={ style.rootLayout }>
                <Layout.Header className={ style.header }>
                    <Link to={ ApplicationContext.context.homePath || '/' } className={ style.logoArea }>
                        {
                            ApplicationContext.context.logo
                                ?
                                [
                                    <InlineSVG src="" key="" className={ style.logo }/>
                                ] : null
                        }
                    </Link>
                    { this.state.header }
                </Layout.Header>
                <Layout className={ style.contentArea }>
                    {
                        this.state.messages !== '' ? (
                            <Row className={ style.marqueeContainer }>
                                <Col span={ 1 } className={ style.marqueeIconContainer }>
                                    <Icon className={ style.marqueeIcon } type="notification" />
                                </Col>
                                <Col span={ 23 } className={ style.marquee }>
                                    <span className={ style.marqueeWord }>{ this.state.messages }</span>
                                </Col>
                            </Row>
                        ) : null
                    }
                    {
                        (!ApplicationContext.context.menuMode || ApplicationContext.context.menuMode === 'inline')
                            ?
                            <Layout.Sider
                                width={ siderWidth }
                                collapsible={ true }
                                collapsed={ this.state.collapsed }
                                onCollapse={ this.handleMenuCollapse }
                            >
                                <SiderMenuBar/>
                            </Layout.Sider>
                            : null
                    }
                    <Layout
                        style={ { marginLeft: siderWidth } }
                        className={
                            `
                                ${style.contentLayout}
                                ${ this.state.collapsed ? style.contentLayoutCollapsed : ''}
                                ${this.state.messages ? style.messagesMarginTop : ''}
                            `
                        }
                    >
                        <Layout.Content className={ style.content } style={ {minHeight: this.state.clientHeight} }>
                            {
                                (path === '/new.html/workspace')
                                    ?
                                    <Redirect to={ ApplicationContext.context.homePath || '' } />
                                    :
                                    <RouteArea path={ this.props.location.pathname } />
                            }
                        </Layout.Content>
                        <Layout.Footer className={ style.footer }>
                            <div className={ style.footerCopyright }>
                                Powered By { ApplicationContext.context.copyright }
                            </div>
                        </Layout.Footer>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}
