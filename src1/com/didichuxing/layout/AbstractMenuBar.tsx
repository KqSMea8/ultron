/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The class of AbstractMenuBar
 */

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Menu, { MenuMode, MenuTheme, SelectParam } from '@antd/menu';
import Icon from '@antd/icon';
import { ISiderMenuData, ISiderMenuMetadata } from 'com/didichuxing/context/IApplicationContext';
import ApplicationContext from 'com/didichuxing/context/ApplicationContext';
import style from 'com/didichuxing/layout/AbstractMenuBar.less';

/**
 * @interface
 * The props of the AbstractMenuBar component
 */
export interface IAbstractMenuBarProps {}

export interface IAbstractMenuBarRouteProps<P extends IAbstractMenuBarProps> extends RouteComponentProps<P> {}

/**
 * @interface
 * The state of the AbstractMenuBar component
 */
export interface IAbstractMenuBarState {}

export default abstract class AbstractMenuBar<P extends IAbstractMenuBarProps = IAbstractMenuBarProps,
    S extends IAbstractMenuBarState = IAbstractMenuBarState> extends React.Component<IAbstractMenuBarRouteProps<P>, S> {

    /**
     * @override
     * @inheritDoc
     * @param {IAbstractMenuBarRouteProps<P extends IAbstractMenuBarProps>} props
     * @param context
     */
    constructor(props: IAbstractMenuBarRouteProps<P>, context?: any) {
        super(props, context);
        this.handleSelectMenuItem = this.handleSelectMenuItem.bind(this);
    }

    /**
     * 递归渲染菜单项
     * @param {ISiderMenuData[]} menus
     * @returns {React.ReactNode}
     */
    private renderMenuItemRecursive(menus: ISiderMenuMetadata[]): React.ReactNode {
        return menus.map<React.ReactNode>((menuMetaData: ISiderMenuMetadata): React.ReactNode => {
            const menuData: ISiderMenuData = menuMetaData as ISiderMenuData;
            if (menuData.children && menuData.children.length) {
                return <Menu.SubMenu>{ this.renderMenuItemRecursive(menuData.children) }</Menu.SubMenu>;
            } else {
                return (
                    <Menu.Item
                        className={
                            menuMetaData.path
                                        .replace('rewrite-', '')
                                        .startsWith(location.pathname.split('/').slice(0, 4).join('/'))
                                        ? 'ant-menu-item-selected' : ''
                        }
                        key={ menuMetaData.path }
                    >
                        <Icon type={ menuData.icon }/>
                        <span>{ menuMetaData.name }</span>
                    </Menu.Item>
                );
            }
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
     * 得到菜单模式
     * {@link http://ant-design.gitee.io/components/menu-cn/}
     * @returns {MenuMode}
     */
    protected abstract get menuMode(): MenuMode;

    /**
     * 菜单的主题。
     * @returns {MenuTheme}
     */
    protected get menuTheme(): MenuTheme {
        return 'light';
    }

    /**
     * @override
     * @inheritDoc
     * @returns {React.ReactNode}
     */
    public render(): React.ReactNode {
        const path: string = this.props.location.pathname;
        if (ApplicationContext.context.siderMenus && ApplicationContext.context.siderMenus.length) {
            let flattenMenus: ISiderMenuMetadata[] = [];
            ApplicationContext.context.siderMenus.forEach((menuItem: ISiderMenuData): void => {
                flattenMenus.push(menuItem);
                if (menuItem.children && menuItem.children.length) {
                    flattenMenus = flattenMenus.concat(menuItem);
                }
            });
            const defaultSelectedKeys: string[] = flattenMenus
                .filter((menuItem: ISiderMenuMetadata): boolean => path.startsWith(menuItem.path))
                .map<string>((menuItem: ISiderMenuMetadata): string => menuItem.path);
            return (
                <Menu
                    mode={ this.menuMode }
                    theme={ this.menuTheme }
                    className={ style.menuBar }
                    defaultSelectedKeys={ defaultSelectedKeys }
                    defaultOpenKeys={ defaultSelectedKeys }
                    onSelect={ this.handleSelectMenuItem }
                >
                    { this.renderMenuItemRecursive(ApplicationContext.context.siderMenus || []) }
                </Menu>
            );
        }
        return null;
    }
}
