/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The class of NormalHeader
 */

import React from 'react';
import HorizontalMenuBar from 'com/didichuxing/layout/HorizontalMenuBar';
import ApplicationContext from 'com/didichuxing/context/ApplicationContext';
import style from 'com/didichuxing/layout/NormalHeader.less';
import { getCircle } from '@ultron/remote/common';
import { Bind } from 'lodash-decorators';
import { observable, action, runInAction, computed } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import { getCookie } from '@ultron/business/common/http/cookies';
/**
 * @interface
 * The props of the NormalHeader component
 */
export interface INormalHeaderProps {
}

/**
 * @interface
 * The state of the NormalHeader component
 */
export interface INormalHeaderState {
}

@observer
export default class NormalHeader<P extends INormalHeaderProps = INormalHeaderProps,
    S extends INormalHeaderState = INormalHeaderState> extends React.Component<P, S> {
    @observable public size: number = 0;
    @observable public tasks: any = [];
    @observable public userName: string = getCookie().username;
    private timer: any = null;

    public componentDidMount(): void {
        this.resp();
    }
    public componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    private async resp(): Promise<void> {
        const result = await getCircle({});
        if (result) {
            runInAction(() => {
                this.size = result.size;
                this.tasks = result.tasks;
            });
        }
        if (!this.timer) {
            this.timer = setInterval(() => {
                this.resp();
            }, 10000);
        }
    }

    /**
     * 渲染header菜单。
     * @returns {React.ReactNode}
     */
    protected renderMenu(): React.ReactNode {
        return (
            (ApplicationContext.context.menuMode && ApplicationContext.context.menuMode === 'horizontal')
                ?
                (
                    <div className={ style.menuBar }>
                        <HorizontalMenuBar/>
                        <div className={ style.headerRight }>
                            <div className={ style.yace }>
                                {
                                    this.size > 0 ? (
                                        <div className={ style.yaceing }>
                                            <div className={ style.yaceingCircle }>
                                                <div className={ style.normalCircleNum }>{ this.size }</div>
                                            </div>
                                            <div className={ style.showHide }>
                                                {
                                                    this.tasks.map(this.renderTaskMenu)
                                                }
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={ style.normalCircle }>
                                            <span className={ style.normalCircleNum }>0</span>
                                        </div>
                                    )
                                }
                            </div>
                            <div className={ style.userBox }>
                                <div className={ style.suserName }>
                                    { this.userName }
                                </div>
                                <div className={ style.headerToolbar }>
                                    <a href="/sso/logout" className={ style.a }>退出登录</a>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null
        );
    }

    @Bind()
    public renderTaskMenu(it) {
        const onClick = () => {
            if (it.pressureType === 1) {
                location.href = `/new.html/old-full-links/detail?planId=${it.planId}&planName=${it.planName}`;
            } else if (it.pressureType === 2) {
                 if (it.pressureMode === 1) {
                    location.href = '/new.html/ultron/interfaceTest/httpSingleDetail' +
                        `?planId=${it.planId}&planName=${it.planName}`;
                 } else if (it.pressureMode === 2) {
                     location.href = '/new.html/ultron/interfaceTest/httpMultiDetail' +
                         `?planId=${it.planId}&planName=${it.planName}`;
                 } else if (it.pressureMode === 3) {
                     location.href = '/new.html/ultron/interfaceTest/httpSceneDetail' +
                         `?planId=${it.planId}&planName=${it.planName}`;
                 }
            } else if (it.pressureType === 4) {
                if (it.pressureMode === 1) {
                    location.href = '/new.html/ultron/interfaceTest/thriftDetail' +
                        `?planId=${it.planId}&planName=${it.planName}`;
                }
            }
        };
        return (
            <div
                key={ it.planId }
                onClick={ onClick }
            >
                {
                    moment(it.startTime * 1000)
                        .format('MM-DD HH:mm')
                }&nbsp;
                {
                    it.planName
                }
            </div>
        );
    }

    /**
     * @override
     * @inheritDoc
     * @returns {React.ReactNode}
     */
    public render(): React.ReactNode {
        return this.renderMenu();
    }
}
