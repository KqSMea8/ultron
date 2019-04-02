/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author zhaoyang@didichuxing
 *
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import { Cookies } from 'react-cookie';

/**
 * 魔镜埋点
 */
export default class MirrorTrack extends React.Component {
    public render(): React.ReactNode {
        const host = location.hostname;
        const MirrorConfig: any[] = [{
            command: 'setCookieSystemNameForTaotie',
            parameter: /ultron\./.test(host) ? 'ULTRON' : (/ultron-test/.test(host) ? 'ULTRONTest' : 'ULTRONDev')
        }, {
            command: 'setCookieUserNameForTaotie',
            parameter: new Cookies().get('username') || 'noName'
        }];

        return (
            <Helmet>
                <script type="text/javascript">
                    { `
                    window.taotieCommandQueue = ${ JSON.stringify(MirrorConfig) };
                    ` }
                </script>
                <script
                    type="text/javascript"
                    src="https://mirror-pub.xiaojukeji.com/sdk/js/track"
                />
            </Helmet>
        );
    }
}
