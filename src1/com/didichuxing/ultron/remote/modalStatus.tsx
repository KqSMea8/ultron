import React from 'react';
import Modal from '@antd/modal';
import style from './modalStatus.less';

export function showStatus() {
    Modal.info({
        title: '操作提示',
        width: 500,
        content: (
            <div>
                <a href="http://upm.xiaojukeji.com/index.html#/" className={ style.a }>
                    <p>对不起你没有相关操作权限，如有需要请到</p>
                    <p>http://upm.xiaojukeji.com/inde.html进行申请，谢谢</p>
                </a>
            </div>
        )
    });
}
