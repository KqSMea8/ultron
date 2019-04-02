import React, { Component } from 'react';
import 'antd/dist/antd.css';
import ReactDOM from 'react-dom';
import { Tree, Input } from 'antd';
import { getOdinTree } from '@ultron/remote/testTask';
import DataTransferComponent from 'com/didichuxing/components/DataTransferComponent';
import { get } from 'com/didichuxing/utils/request';
import { Bind } from 'lodash-decorators';
import style from './OdinTree.less';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

interface IMachinePathProps {
    getSelectValues(val: string): void;
}

interface IMachinePathState {
    gData: any[];
    dataList: any[];
    expandedKeys: any[];
    searchValue: '';
    loading: boolean;
    autoExpandParent: boolean;
}

export default class SearchTree extends DataTransferComponent<IMachinePathProps, IMachinePathState> {
    constructor(props: IMachinePathProps, context?: IMachinePathState) {
        super(props, context);
        this.state = {
            gData: [],
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            loading: true,
            dataList: []
        };
        this.onSelect = this.onSelect.bind(this);
    }

    @Bind()
    public generateList(data) {
        data.forEach((item) => {
            const node = item;
            const key: any = node.ns;
            const title: any = node.name;
            this.state.dataList.push({ key, title });
            if (node.children) {
                this.generateList(node.children);
            }
        });
    }
    @Bind()
    public getParentKey(key, tree) {
        let parentKey;
        tree.forEach((item) => {
            const node = item;
            if (node.children) {
                if (node.children.some((items) => {
                        return (String(items.ns) === key);
                    })) {
                    parentKey = String(node.ns);
                } else if (this.getParentKey(key, node.children)) {
                    parentKey = this.getParentKey(key, node.children);
                }
            }
        });
        return parentKey;
    }
    @Bind()
    public onExpand(expandedKeys) {
        this.setState({
            expandedKeys,
            autoExpandParent: false
        });
    }
    @Bind()
    public onSelect(selectedKeys, event) {
        const category = event.node.props['data-key'];
        if (category === 'cluster' || category === 'leaf') {
            this.props.getSelectValues(selectedKeys.toString());
        }
    }

    /**
     * 渲染前调用
     */
    public componentWillMount(): void {
        this.getChartData();
    }

    /**
     * 获取tree数据
     */
    private async getChartData(): Promise<void> {
        try {
            const ajaxParams = {};
            const resData = await getOdinTree(ajaxParams);
            this.setState({
                gData: resData.children,
                loading: false
            });
            this.generateList(this.state.gData);
        } catch (e) {
        }
    }
    @Bind()
    public onChange(e) {
        const value = e.target.value;
        const expandedKeys = this.state.dataList.map((item) => {
            if (item.title.indexOf(value) > -1) {
                return this.getParentKey(item.key, this.state.gData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true
        });
    }

    public render() {
        const { searchValue, expandedKeys, autoExpandParent } = this.state;
        const loop = (data) => {
            if (data.length > 0) {
                return (
                    data.map((item) => {
                        const index = item.name.indexOf(searchValue);
                        const beforeStr = item.name.substr(0, index);
                        const afterStr = item.name.substr(index + searchValue.length);
                        const title = index > -1 ? (
                            <span>{ beforeStr }
                                <span style={ { color: '#f50' } }>{ searchValue }</span>
                                { afterStr }</span>
                        ) : <span>{ item.name }</span>;
                        if (item.children) {
                            return (
                                <TreeNode
                                    key={ item.ns }
                                    title={ title }
                                    data-key={ item.category }
                                >
                                    { loop(item.children) }
                                </TreeNode>
                            );
                        }
                        return <TreeNode key={ item.ns } title={ title }/>;
                    }));
            }
        };
        return (
            <div className={ style.odin }>
                <Search
                    style={ { marginBottom: 8, width: '80%' } }
                    placeholder="Search"
                    onChange={ this.onChange }
                />
                <Tree
                    onExpand={ this.onExpand }
                    expandedKeys={ expandedKeys }
                    autoExpandParent={ autoExpandParent }
                    onSelect={ this.onSelect }
                >
                    { loop(this.state.gData) }
                </Tree>
            </div>
        );
    }
}
