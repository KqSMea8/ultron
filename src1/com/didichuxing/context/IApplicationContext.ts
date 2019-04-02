/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The inferface of IApplicationContext
 */

import { MenuMode } from '@antd/menu';

export interface IRouteConfig {
    [path: string]: string | IRouteConfigDetail;
}

export interface IRouteConfigDetail {

    /**
     * @readonly
     * 组件的完整类名
     */
    readonly component: string;

    /**
     * @readonly
     * 该组件包含其他的路由信息。
     */
    readonly routes?: IRouteConfig;
}

export interface IResponseBodyKey {
    /**
     * @readonly
     * response数据对应的key值。
     */
    readonly dataKey: string;

    /**
     * @readonly
     * response error 信息对应的key值。
     */
    readonly errorMsgKey: string;

    /**
     * @readonly
     * response error code对应的key值。
     */
    readonly errorCodeKey: string;
}

export interface ISiderMenuMetadata {
    /**
     * @readonly
     * 菜单名称
     */
    readonly name: string;

    /**
     * @readonly
     * 菜单访问路径
     */
    readonly path: string;
}

export interface ISiderMenuData extends ISiderMenuMetadata {

    /**
     * @readonly
     * 菜单的icon
     */
    readonly icon: string;

    /**
     * @readonly
     * 下级菜单。
     */
    readonly children?: ISiderMenuMetadata[];
}

export interface IApplicationConfiguration {

    /**
     * @readonly
     * 应用名
     */
    readonly appName?: string;

    /**
     * @readonly
     * 默认首页路径
     */
    readonly homePath?: string;

    /**
     * @readonly
     * 默认logo路径，已/public为资源根目录。
     */
    readonly logo?: string;

    /**
     * @readonly
     * 版权信息。
     */
    readonly copyright?: string;

    /**
     * @readonly
     * 路由的配置信息。
     */
    readonly routes?: IRouteConfig;

    /**
     * @readonly
     * 菜单模式
     * {@link http://ant-design.gitee.io/components/menu-cn/}
     */
    readonly menuMode?: MenuMode;

    /**
     * @readonly
     * 菜单配置数据
     */
    readonly siderMenus?: ISiderMenuData[];

    /**
     * @readonly
     * 上下文动态数据launcher类全名。
     * @see {@link com/didichuxing/context/IApplicationDynamicContextLauncher}
     */
    readonly contextLauncher?: string;

    /**
     * @readonly
     * response body数据key值。
     */
    readonly responseBodyKey?: IResponseBodyKey;

    /**
     * @readonly
     * header class full name
     */
    readonly header?: string;
}

export interface IApplicationContext extends IApplicationConfiguration {}
