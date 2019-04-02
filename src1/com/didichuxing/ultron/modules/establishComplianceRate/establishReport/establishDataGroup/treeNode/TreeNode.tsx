/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author zhukai@didichuxing
 * @file The page class of Ultron
 */
import React from 'react';
import { Bind } from 'lodash-decorators';
import DataTransferComponent from 'com/didichuxing/components/DataTransferComponent';
import { Tree, Icon, Skeleton, Tag } from 'antd';
import message from '@antd/message';
import { cqiDataGroupModule, cqiModuleQueryExist } from '@ultron/remote/plate';
import ServiceModule from './serviceModule/ServiceModule';
import style from './TreeNode.less';
const filterIcon = (category) => {
    return (
        {
            group: `url(${require('./base64Icon/g.png')}) no-repeat center center`,
            service: `url(${require('./base64Icon/s.png')}) no-repeat center center`,
            cluster: `url(${require('./base64Icon/c.png')}) no-repeat center center`,
            product: `url(${require('./base64Icon/p.png')}) no-repeat center center`
        }[category]
    );
};
interface ITreeNodeProps {
    getCheckedKeys(checkedKeys: string[]);
}

interface ITreeNodeState {
    treeNode: React.ReactNode[];
    expandedKeys: string[];
    checkedKeys: string[];
    loading: boolean;
    isShowModal: boolean;
    selectedKeys: string[];
    hasConfigure: boolean;
}
export default class TreeNode extends DataTransferComponent<ITreeNodeProps, ITreeNodeState> {
    constructor(props: ITreeNodeProps, context?: ITreeNodeState) {
        super(props, context);
        this.state = {
            treeNode: [],
            expandedKeys: [],
            checkedKeys: [],
            loading: true,
            isShowModal: false,
            selectedKeys: [],
            hasConfigure: false
        };
    }
    @Bind()
    private async fetchData() {
        if (!window['dataGroupModule']) {
            window['dataGroupModule'] = await cqiDataGroupModule({});
        }
        const treeNode: React.ReactNode[]
        = this.executeTree(window['dataGroupModule'].children[0].children[0].children);

        this.setState({
            treeNode,
            loading: false
        });
    }
    /**
     * 组装树形结构
     */
    @Bind()
    private executeTree(data) {
        return (
            data.map((item) => {
                if (item.children) {
                  return (
                    <Tree.TreeNode
                        icon={
                            item.category &&
                                <div
                                    className={ style.icon }
                                    style={ {background: filterIcon(item.category)} }
                                >
                                    占位
                                </div>
                        }
                        title={ item.title }
                        key={ item.key }
                        className={
                            `
                                ${item.category === 'cluster' ? style.hasCheckBox : style.noCheckBox}
                                ${(!item.category || item.category === 'product') ? style.noIcon : style.hasIcon}
                            `
                        }
                        disableCheckbox={ item.category !== 'cluster' }
                        selectable={ item.category === 'cluster' }
                    >
                      { this.executeTree(item.children) }
                    </Tree.TreeNode>
                  );
                }
              })
        );
    }
    @Bind()
    private onCheckTree(checkedKeys, e) {
        if (e.checked) {
            cqiModuleQueryExist({ns: checkedKeys[checkedKeys.length - 1]}).then((result: any) => {
                if (result === 'true') {
                    this.setState({
                        checkedKeys
                    });
                } else {
                    message.warning('当前节点未配置，请配置后添加');
                }
            });
        } else {
            this.setState({
                checkedKeys
            });
        }
    }
    @Bind()
    private onExpand(expandedKeys: string[]) {
        this.setState({
            expandedKeys
        });
    }
    /**
     * 隐藏modal
     */
    @Bind()
    private hideModal(): void {
        this.setState({
            isShowModal: false
        });
    }
    /**
     * 点击树节点
     */
    @Bind()
    private onSelect(selectedKeys: string[]) {
        selectedKeys.length && this.setState({
            isShowModal: true,
            selectedKeys: selectedKeys
        });
    }
    public componentWillMount() {
        this.receiveTopic('@Ultron/TreeNode/getCheckedKeys', (data) => {
            this.props.getCheckedKeys(this.state.checkedKeys);
        });
        this.fetchData();
    }
    public render(): React.ReactNode {
        return (
            <div>
                <div className={ style.tree }>
                    {
                        this.state.loading ? <Skeleton active={ true }/> :
                        <Tree
                            showIcon={ true }
                            checkable={ true }
                            onExpand={ this.onExpand }
                            expandedKeys={ this.state.expandedKeys }
                            onCheck={ this.onCheckTree }
                            checkedKeys={ this.state.checkedKeys }
                            onSelect={ this.onSelect }
                        >
                            {
                                this.state.treeNode.length ? this.state.treeNode : ''
                            }
                        </Tree>
                    }
                </div>
                {
                    !!this.state.checkedKeys.length
                    &&
                    <div className={ style.exhibition }>
                        {
                            this.state.checkedKeys.map((item, index) => {
                                return (
                                    <Tag key={ index }>{ item }</Tag>
                                );
                            })
                        }
                    </div>
                }
                {
                    this.state.isShowModal
                    &&
                    <ServiceModule
                        selectedKeys={ this.state.selectedKeys }
                        isShowModal={ this.state.isShowModal }
                        hideModal={ this.hideModal }
                    />
                }
            </div>
        );
    }
}
