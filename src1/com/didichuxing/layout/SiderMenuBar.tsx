/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The class of SiderMenuBar
 */

import React from 'react';
import { withRouter } from 'react-router-dom';
import { MenuMode , MenuTheme} from '@antd/menu';
import AbstractMenuBar, {
    IAbstractMenuBarRouteProps,
    IAbstractMenuBarProps,
    IAbstractMenuBarState
} from 'com/didichuxing/layout/AbstractMenuBar';

/**
 * @interface
 * The props of the SiderMenuBar component
 */
interface ISiderMenuBarProps extends IAbstractMenuBarProps {}

/**
 * @interface
 * The state of the SiderMenuBar component
 */
interface ISiderMenuBarState extends IAbstractMenuBarState {}

class SiderMenuBar extends AbstractMenuBar<ISiderMenuBarProps, ISiderMenuBarState> {

    /**
     * @override
     * @inheritDoc
     * @returns {MenuMode}
     */
    protected get menuMode(): MenuMode {
        return 'inline';
    }

    /**
     * @override
     * @inheritDoc
     * @returns {MenuTheme}
     */
    protected get menuTheme(): MenuTheme {
        return 'dark';
    }
}

export default withRouter<IAbstractMenuBarRouteProps<ISiderMenuBarProps>>(SiderMenuBar);
