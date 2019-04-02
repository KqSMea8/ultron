/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author zhaoyang@didichuxing
 *
 */
import React from 'react';
import Layout from '@antd/layout';
import { Helmet } from 'react-helmet';

interface IDDMapProps {
    mapOnLoad();
}

/**
 * 地图API
 */
export default class DDMapComponent extends React.Component<IDDMapProps> {
    constructor(props: IDDMapProps, context?: any) {
        super(props, context);

        window['AmapOnLoadCallback'] = () => {
            setTimeout(() => {
                this.props.mapOnLoad();
            }, 100);
        };
    }

    public render(): React.ReactNode {
        const apiUrl = [
            'https://webapi.amap.com/maps',
            [
                'v=1.4.8',
                'key=788e08def03f95c670944fe2c78fa76f',
                'plugin=AMap.Autocomplete,AMap.Driving',
                'callback=AmapOnLoadCallback'
            ].join('&')
        ].join('?');

        return (
            <Layout>
                <Helmet>
                    <script
                        type="text/javascript"
                        src={ apiUrl }
                    />
                </Helmet>
            </Layout>
        );
    }
}
