/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The class of PlusOperator
 */

import React from 'react';
import ReactDOM from 'react-dom';
import scrollIntoView from 'scroll-into-view';
import Icon from '@antd/icon';
import Button from '@antd/button';
import style from 'com/didichuxing/components/PlusOperator.less';
const List = require('collections/list');

/**
 * @interface
 * The props of the PlusOperator component
 */
interface IPlusOperatorProps<T> {
    readonly values?: T[];
    readonly className?: string;
    renderItem(value: T, index: number): React.ReactNode;
    renderDeletedIcon?(value: T, index: number): React.ReactNode;
    getItemDefaultValue(): T;
    onChange?(plus: T[], minus: T[], values: T[]): void;
    onBeforeChange?(plus: T[], minus: T[]): Promise<void>;
    getScrollContainer?(): HTMLElement;
}

/**
 * @interface
 * The state of the PlusOperator component
 */
interface IPlusOperatorState<T> {
    valueList: any;
}

export default class PlusOperator<T> extends React.Component<IPlusOperatorProps<T>, IPlusOperatorState<T>> {

    /**
     * @constructor
     * @param {IPlusOperatorRouteProps} props
     * @param {any} context
     */
    constructor(props: IPlusOperatorProps<T>, context?: any) {
        super(props, context);
        if (props.values && !props.values.length) {
            props.values.push(props.getItemDefaultValue());
        }
        this.state = {
            valueList: new List(props.values || [props.getItemDefaultValue()])
        };
        this.handlePlus = this.handlePlus.bind(this);
        this.plusItem = this.plusItem.bind(this);
        this.handleAddRangeChange = this.handleAddRangeChange.bind(this);
        this.addValue = this.addValue.bind(this);
        this.deleteValue = this.deleteValue.bind(this);
        this.state.valueList.addRangeChangeListener(this.handleAddRangeChange);
    }

    /**
     * @see {@link http://www.collectionsjs.com/method/add-range-change-listener}
     * range change handler
     * @param {T[]} plus
     * @param {T[]} minus
     * @param {number} index
     */
    private handleAddRangeChange(plus: T[], minus: T[], index: number): void {
        if (plus && plus.length) { // plus
            this.forceUpdate((): void => {
                this.plusItem(plus, minus);
            });
        } else if (minus && minus.length) { // remove
            this.forceUpdate((): void => {
                this.executeChange(plus, minus);
            });
        }
    }

    /**
     * @override
     * @inheritDoc
     * @param {Readonly<IPlusOperatorProps<T>>} nextProps
     * @param nextContext
     */
    public componentWillReceiveProps(nextProps: Readonly<IPlusOperatorProps<T>>, nextContext: any): void {
        if (this.props.values !== nextProps.values) {
            this.state.valueList.splice
                .apply(this.state.valueList, [0, this.state.valueList.length].concat(nextProps.values));
        }
    }

    /**
     * @override
     * @inheritDoc
     */
    public componentWillUnmount(): void {
        this.state.valueList.removeRangeChangeListener(this.handleAddRangeChange);
    }

    /**
     * 执行数据变化。
     * @param {T[]} plus
     * @param {T[]} minus
     */
    private executeChange(plus: T[], minus: T[]): void {
        this.props.onChange && this.props.onChange(plus, minus, this.state.valueList.toArray());
    }

    /**
     * 增加item逻辑
     */
    private plusItem(plus: T[], minus: T[]): void {
        scrollIntoView(ReactDOM.findDOMNode(this).querySelectorAll('li')[this.state.valueList.length - 1], {
            validTarget: (target: HTMLElement, parentsScrolled: number): boolean => {
                if (this.props.getScrollContainer) {
                    return target === this.props.getScrollContainer();
                } else {
                    return parentsScrolled < 2;
                }
            }
        });
        this.executeChange(plus, minus);
    }

    /**
     * 处理添加事件。
     * @param {React.MouseEvent<HTMLButtonElement>} event
     */
    private handlePlus(event: React.MouseEvent<HTMLButtonElement>): void {
        this.addValue(this.props.getItemDefaultValue());
    }

    /**
     * 新增给定的值。
     * @param {T} value
     */
    public addValue(value: T): void {
        if (this.props.onBeforeChange) {
            this.props.onBeforeChange([value], []).then((): void => {
                this.state.valueList.add(value);
            }).catch((): void => { /**/ });
        } else {
            this.state.valueList.add(value);
        }
    }

    /**
     * 删除给定的值。
     * @param {T} value
     */
    public deleteValue(value: T): void {
        if (this.props.onBeforeChange) {
            this.props.onBeforeChange([], [value]).then((): void => {
                this.state.valueList.delete(value);
            }).catch((): void => { /**/ });
        } else {
            this.state.valueList.delete(value);
        }
    }

    /**
     * 处理删除事件。
     * @param {React.MouseEvent<HTMLAnchorElement>} event
     */
    private handleDelete(value: T): React.MouseEventHandler<HTMLAnchorElement> {
        return (event: React.MouseEvent<HTMLAnchorElement>): void => {
            event.preventDefault();
            this.deleteValue(value);
        };
    }

    /**
     * @override
     * @inheritDoc
     * @returns {React.ReactNode}
     */
    public render(): React.ReactNode {
        let index: number = 0;
        return (
            <ul className={ `${style.plusOperator} ${this.props.className || ''}` }>
                {
                    this.state.valueList.map((value: T): React.ReactNode => {
                        const itemNode: React.ReactNode = (
                            <li className={ style.plusOperatorItem } key={ `__plus-operation-item-${index}` }>
                                { this.props.renderItem(value, index) }
                                <span className={ `${style.plusOperatorDelete} plus-operator-delete-area` }>
                                    {
                                        this.state.valueList.length > 1
                                            ?
                                            (
                                                this.props.renderDeletedIcon
                                                    ?
                                                    this.props.renderDeletedIcon(value, index)
                                                    :
                                                    <Icon
                                                        type="delete"
                                                        onClick={ this.handleDelete(value) }
                                                    />
                                            )
                                            : null
                                    }
                                </span>
                            </li>
                        );
                        ++index;
                        return itemNode;
                    })
                }
                <li className={ style.plusOperatorBtnBar }>
                    <Button
                        type="dashed"
                        htmlType="button"
                        icon="plus"
                        className={ style.plusOperatorBtn }
                        onClick={ this.handlePlus }
                    />
                </li>
            </ul>
        );
    }
}
