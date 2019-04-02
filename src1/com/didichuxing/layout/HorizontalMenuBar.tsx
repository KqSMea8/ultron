/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The class of HorizontalMenuBar
 */

import React from 'react';
import { withRouter } from 'react-router-dom';
import { MenuMode } from '@antd/menu';
import AbstractMenuBar, {
    IAbstractMenuBarRouteProps,
    IAbstractMenuBarProps,
    IAbstractMenuBarState
} from 'com/didichuxing/layout/AbstractMenuBar';

/**
 * @interface
 * The props of the HorizontalMenuBar component
 */
interface IHorizontalMenuBarProps extends IAbstractMenuBarProps {}

/**
 * @interface
 * The state of the HorizontalMenuBar component
 */
interface IHorizontalMenuBarState extends IAbstractMenuBarState {}

class HorizontalMenuBar extends AbstractMenuBar<IHorizontalMenuBarProps, IHorizontalMenuBarState> {

    /**
     * @override
     * @inheritDoc
     * @returns {MenuMode}
     */
    protected get menuMode(): MenuMode {
        return 'horizontal';
    }
}

export default withRouter<IAbstractMenuBarRouteProps<IHorizontalMenuBarProps>>(HorizontalMenuBar);
