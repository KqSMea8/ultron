import React from 'react';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { AView } from 'com/didichuxing/commonInterface/AView';
import { Input, Table, Modal, Button, Tabs, Card, Form, Row, Col, Checkbox, Spin, Select } from 'antd';
import { cqiReportOptions } from '@ultron/remote/plate';
import { observer } from 'mobx-react';
import {observable, runInAction} from 'mobx';
import {getThriftTypeList} from '@ultron/remote/testConfig';
import style from './CapacityReport.less';

interface ICapacityReportProps {
    changeSelectedKey;
    goToBusinessDetails;
}

interface ICapacityReportState {
    spinLoading: boolean;
    searchValue: string;
    dataSource;
}
@observer
export default class CapacityReport extends React.Component<ICapacityReportProps, ICapacityReportState> {
    private dataSource: any[] = [];
    constructor(props: ICapacityReportProps, context?: ICapacityReportState) {
        super(props, context);
        this.state = {
            spinLoading: true,
            searchValue: '',
            dataSource: []
        };
    }
    @Bind()
    private startSearch(value: string): void {
        if (!this.dataSource.length) {
            return;
        }
        if (value.trim() === '') {
            this.setState({
                dataSource: this.dataSource
            });
            return;
        }
        const newDataSource: any[] = [];
        this.dataSource.forEach((item) => {
            if (
                item['dataTypeDesc'].toLowerCase().indexOf(value.trim().toLowerCase()) !== -1 ||
                item['groupName'].toLowerCase().indexOf(value.trim().toLowerCase()) !== -1
            ) {
                newDataSource.push(item);
            }
        });
        this.setState({
            dataSource: newDataSource
        });
    }
    @Bind()
    private searchValueChange(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            searchValue: event.currentTarget.value
        });
    }
    @Bind()
    private fetchData() {
        cqiReportOptions({}).then((result) => {
            result && (this.dataSource = result, this.setState({
                dataSource: result
            }));
        }).catch((err) => {
            console.error(err);
        });
    }
    @Bind()
    private statusFilter(statusNumber: number) {
        return [
            '未处理',
            '处理中',
            '已完成'
        ][statusNumber];
    }
    @Bind()
    private changeSelectedKey() {
        this.props.changeSelectedKey('establishReport');
    }
    @Bind()
    private goToBusinessDetails(event: React.MouseEvent<HTMLAnchorElement>) {
        this.props.goToBusinessDetails(
            event.currentTarget.dataset['reportid'], event.currentTarget.dataset['groupname']
        );
    }

    public async componentWillMount() {
        await this.fetchData();
        this.setState({
            spinLoading: false
        });
    }

    public render(): React.ReactNode {
        const columns: any = [{
            title: '数据组',
            dataIndex: 'groupName',
            key: 'groupName',
            align: 'center',
            render: (text, record) => {
                return (
                    <a
                        data-reportid={ record['reportId'] }
                        data-groupname={ text }
                        href="javascript:;"
                        onClick={ this.goToBusinessDetails }
                    >
                        { text }
                    </a>
                );
            }
        }, {
            title: '数据类别',
            dataIndex: 'dataTypeDesc',
            key: 'dataTypeDesc',
            align: 'center'
        }, {
            title: '开始时间',
            dataIndex: 'beginTime',
            key: 'beginTime',
            align: 'center',
            className: style.tableBeginTime,
            render: (text) => {
                return (
                    moment(text * 1000)
                        .format('YYYY.MM.DD HH:mm')
                );
            }
        }, {
            title: '结束时间',
            dataIndex: 'endTime',
            key: 'endTime',
            align: 'center',
            className: style.tableEndTime,
            render: (text) => {
                return (
                    moment(text * 1000)
                        .format('YYYY.MM.DD HH:mm')
                );
            }
        }, {
            title: '报告状态',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            className: style.tableStatus,
            render: (text) => {
                return this.statusFilter(text);
            }
        }];
        return (
            <div className={ style.capacityReport }>
                <Spin
                    spinning={ this.state.spinLoading }
                    size="large"
                >
                    <Card
                        bordered={ false }
                        title="容量报告"
                    >
                        <Row className={ style.search }>
                            <Col span={ 2 }>
                                <Button onClick={ this.changeSelectedKey } type="primary"  >新建报告</Button>
                            </Col>
                            <Col offset={ 16 } span={ 6 }>
                                <Input.Search
                                    placeholder="请输入关键字"
                                    onSearch={ this.startSearch }
                                    enterButton={ true }
                                    value={ this.state.searchValue }
                                    onChange={ this.searchValueChange }
                                />
                            </Col>
                        </Row>
                        <Row className={ style.table }>
                            <Table
                                bordered={ true }
                                rowKey="reportId"
                                columns={ columns }
                                dataSource={ this.state.dataSource.sort((a, b) => {
                                    return (
                                        b['beginTime'] - a['beginTime']
                                    );
                                }) }
                            />
                        </Row>
                    </Card>
                </Spin>
            </div>
        );
    }
}
