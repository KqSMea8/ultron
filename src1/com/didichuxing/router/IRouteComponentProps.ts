/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The inferface of IRouteComponentProps
 */

import { RouteComponentProps } from 'react-router-dom';

export interface IRouteComponentProps<P, Q> extends RouteComponentProps<P> {
    query: Q;
}
