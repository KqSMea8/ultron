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
import { Modal, Form, Skeleton, Button, Select, Input, Tabs, Row, Col, Icon } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { cqiModuleQuery, cpiModuleUpdate } from '@ultron/remote/plate';
import style from './ServiceModule.less';

/**
 * 子表单布局
 */
const formItemLayout = {
    labelCol: {span: 4, offset: 3},
    wrapperCol: { span: 12 }
};
/**
 * 域名个数
 */
let id = 0;
/**
 * metric域名个数
 */
let metricId = 0;
interface IServiceModuleProps extends FormComponentProps {
    selectedKeys: string[];
    isShowModal: boolean;
    hideModal();
}

interface IServiceModuleState {
    queryData: object;
    activeKey: string;
}
class ServiceModule extends DataTransferComponent<IServiceModuleProps, IServiceModuleState> {
    constructor(props: IServiceModuleProps, context?: IServiceModuleState) {
        super(props, context);
        this.state = {
            queryData: {},
            activeKey: 'srm'
        };
    }
    @Bind()
    private fetchData() {
        cqiModuleQuery({
            ns: this.props.selectedKeys[0]
        }).then((result) => {
            this.setState({
                queryData: result
            });
        });
    }
    @Bind()
    private hide() {
        this.props.hideModal();
    }
    @Bind()
    private handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
            const srm = {};
            srm['organization'] = values['organization'];

            const router = {};
            if (!!values['names']) {
                values['names'].forEach((item, index) => {
                    router[values['names'][index]] = values['interface'][index].split('\n');
                });
            }
            if (!!values['existName']) {
                values['existName'].forEach((item, index) => {
                    router[item] = values['existInterface'][index].split('\n');
                });
            }
            srm['router'] = router;

            srm['inRouter'] = values['inRouter'].split('\n');

            const odinMetric: any[] = [];
            if (!!values['metricExistNames']) {
                values['metricExistNames'].forEach((item, index) => {
                    odinMetric.push({
                        name: item,
                        count: values['metricExistCounts'][index],
                        errCount: values['metricExistErrCounts'][index],
                        latency: values['metricExistLatencys'][index]
                    });
                });
            }
            if (!!values['metricNames']) {
                values['metricNames'].forEach((item, index) => {
                    odinMetric.push({
                        name: item,
                        count: values['metricCounts'][index],
                        errCount: values['metricErrCounts'][index],
                        latency: values['metricLatencys'][index]
                    });
                });
            }
            Modal.confirm({
                title: '确认提交吗？',
                cancelText: '取消',
                okText: '确认',
                onOk: () => {
                    cpiModuleUpdate({
                        ns: this.props.selectedKeys[0],
                        businessId: values['businessId'],
                        id: this.state.queryData['id'],
                        name: values['name'],
                        srm: srm,
                        odinMetric: odinMetric
                    }).then(() => {
                        this.props.hideModal();
                    });
                }
            });
            }
        });
    }
    @Bind()
    private tabsCallback(value): void {
        this.setState({
            activeKey: value
        });
    }
    /**
     * 新增router
     */
    @Bind()
    private add(): void {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(++id);
        form.setFieldsValue({
            keys: nextKeys
        });
    }
    @Bind()
    private removeRouter(event: React.MouseEvent<HTMLElement>) {
        const k: number = Number(event.currentTarget.dataset['k']);
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        form.setFieldsValue({
            keys: keys.filter((key) => {
                return key !== k;
            })
        });
      }
    @Bind()
    private addMetric(): void {
        const { form } = this.props;
        const keys = form.getFieldValue('metricKeys');
        const nextKeys = keys.concat(++metricId);
        form.setFieldsValue({
            metricKeys: nextKeys
        });
    }
    @Bind()
    private remove(event: React.MouseEvent<HTMLElement>) {
        const k: number = Number(event.currentTarget.dataset['k']);
        const { form } = this.props;
        const keys = form.getFieldValue('metricKeys');
        form.setFieldsValue({
            metricKeys: keys.filter((key) => {
                return key !== k;
            })
        });
      }
    /**
     * 新增域名
     */
    @Bind()
    private addFormItems(): React.ReactNode {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const result: React.ReactNode = keys.map((k) => (
            <div key={ k } className={ style.addFormItems }>
                <Row>
                    <Col span={ 2 } offset={ 3 } className={ style.pre }>
                        域名:
                    </Col>
                    <Col span={ 16 }>
                        <Form.Item>
                        {
                            getFieldDecorator(`names[${k}]`, {})(
                                <Row>
                                    <Input placeholder="请输入域名" />
                                </Row>
                            )
                        }
                        </Form.Item>
                    </Col>
                    <Col span={ 2 } offset={ 1 } className={ style.after }>
                        {
                            <Icon
                                type="minus-circle-o"
                                data-k={ k }
                                onClick={ this.removeRouter }
                            />
                        }
                    </Col>
                </Row>
                <Row>
                    <Col span={ 2 } offset={ 3 }>
                        接口:
                    </Col>
                    <Col span={ 16 }>
                        <Form.Item>
                        {
                            getFieldDecorator(`interface[${k}]`, {})(
                                <Row>
                                    <Input.TextArea placeholder="请输入接口" rows={ 3 }/>
                                </Row>
                            )
                        }
                        </Form.Item>
                    </Col>
                </Row>
            </div>
          ));
        return result;
    }
    /**
     * 组装已有域名
     */
    @Bind()
    private executeFormItems(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;
        const routerObj: object = this.state.queryData['srm']['router'];
        const keys: any[] = [];
        for (const j in routerObj) {
            if (!!j) {
                keys.push([j, routerObj[j]]);
            }
        }
        const result: React.ReactNode = keys.map((item, index) => (
            <Row key={ index }>
                <Col span={ 2 }>
                    域名:
                </Col>
                <Col span={ 8 }>
                    <Form.Item>
                    {
                        getFieldDecorator(`existName[${index}]`, {initialValue: item[0]})(
                            <Row>
                                <Input placeholder="请输入域名" defaultValue={ item[0] }/>
                            </Row>
                        )
                    }
                    </Form.Item>
                </Col>
                <Col span={ 2 } offset={ 1 }>
                    接口:
                </Col>
                <Col span={ 11 }>
                    <Form.Item>
                    {
                        getFieldDecorator(`existInterface[${index}]`, {initialValue: item[1].join('\n')})(
                            <Row>
                                <Input.TextArea placeholder="请输入接口" defaultValue={ item[1].join('\n') } rows={ 3 }/>
                            </Row>
                        )
                    }
                    </Form.Item>
                </Col>
            </Row>
          ));
        return result;
    }
    /**
     * 组装已有metric域名
     */
    @Bind()
    private executeMetricItems(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;
        const routerArr: any[] = this.state.queryData['odinMetric'];
        const result: React.ReactNode = routerArr.map((item, index) => (
            <div key={ index }>
                <Row className={ style.metricItem }>
                    <Col span={ 18 }  offset={ 3 }>
                        <Form.Item>
                        {
                            getFieldDecorator(`metricExistNames[${index}]`, {initialValue: item['name']})(
                                <Row>
                                    <Input addonBefore="名称" defaultValue={ item['name'] }/>
                                </Row>
                            )
                        }
                        </Form.Item>
                    </Col>
                </Row>
                <Row className={ style.metricItem }>
                    <Col span={ 18 }  offset={ 3 }>
                        <Form.Item>
                        {
                            getFieldDecorator(`metricExistCounts[${index}]`, {initialValue: item['count']})(
                                <Row>
                                    <Input
                                        addonBefore="总流量"
                                        placeholder="例如：http://monitor.odin.xiaojukeji.com/#/tmpgraph/1997573"
                                        defaultValue={ item['count'] }
                                    />
                                </Row>
                            )
                        }
                        </Form.Item>
                    </Col>
                </Row>
                <Row className={ style.metricItem }>
                    <Col span={ 18 }  offset={ 3 }>
                        <Form.Item>
                        {
                            getFieldDecorator(`metricExistErrCounts[${index}]`, {initialValue: item['errCount']})(
                                <Row>
                                    <Input
                                        addonBefore="成功率"
                                        placeholder="例如：http://monitor.odin.xiaojukeji.com/#/tmpgraph/1997573"
                                        defaultValue={ item['errCount'] }
                                    />
                                </Row>
                            )
                        }
                        </Form.Item>
                    </Col>
                </Row>
                <Row className={ style.metricItem }>
                    <Col span={ 18 }  offset={ 3 }>
                        <Form.Item>
                        {
                            getFieldDecorator(`metricExistLatencys[${index}]`, {initialValue: item['latency']})(
                                <Row>
                                    <Input
                                        addonBefore="耗时"
                                        placeholder="例如：http://monitor.odin.xiaojukeji.com/#/tmpgraph/1997573"
                                        defaultValue={ item['latency'] }
                                    />
                                </Row>
                            )
                        }
                        </Form.Item>
                    </Col>
                </Row>
            </div>
          ));
        return result;
    }
    /**
     * 新增metric
     */
    @Bind()
    private addMetricItems(): React.ReactNode {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('metricKeys', { initialValue: [] });
        const keys = getFieldValue('metricKeys');
        const result: React.ReactNode = keys.map((item) => (
            <div key={ item }>
                <Row className={ style.metricItem }>
                    <Col span={ 18 }  offset={ 3 }>
                        <Form.Item>
                        {
                            getFieldDecorator(`metricNames[${item}]`, {})(
                                <Row>
                                    <Input addonBefore="名称" />
                                </Row>
                            )
                        }
                        </Form.Item>
                    </Col>
                    <Col span={ 2 } offset={ 1 }>
                        {
                            <Icon
                                type="minus-circle-o"
                                data-k={ item }
                                onClick={ this.remove }
                            />
                        }
                    </Col>
                </Row>
                <Row className={ style.metricItem }>
                    <Col span={ 18 }  offset={ 3 }>
                        <Form.Item>
                        {
                            getFieldDecorator(`metricCounts[${item}]`, {})(
                                <Row>
                                    <Input
                                        addonBefore="总流量"
                                        placeholder="例如：http://monitor.odin.xiaojukeji.com/#/tmpgraph/1997573"
                                    />
                                </Row>
                            )
                        }
                        </Form.Item>
                    </Col>
                </Row>
                <Row className={ style.metricItem }>
                    <Col span={ 18 }  offset={ 3 }>
                        <Form.Item>
                        {
                            getFieldDecorator(`metricErrCounts[${item}]`, {})(
                                <Row>
                                    <Input
                                        addonBefore="成功率"
                                        placeholder="例如：http://monitor.odin.xiaojukeji.com/#/tmpgraph/1997573"
                                    />
                                </Row>
                            )
                        }
                        </Form.Item>
                    </Col>
                </Row>
                <Row className={ style.metricItem }>
                    <Col span={ 18 }  offset={ 3 }>
                        <Form.Item>
                        {
                            getFieldDecorator(`metricLatencys[${item}]`, {})(
                                <Row>
                                    <Input
                                        addonBefore="耗时"
                                        placeholder="例如：http://monitor.odin.xiaojukeji.com/#/tmpgraph/1997573"
                                    />
                                </Row>
                            )
                        }
                        </Form.Item>
                    </Col>
                </Row>
            </div>
          ));
        return result;
    }
    public componentWillMount() {
        this.fetchData();
    }
    public render(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;
        const isQueryDataEmpty = !Object.keys(this.state.queryData).length;
        return (
            <Modal
                visible={ this.props.isShowModal }
                width={ 800 }
                title="当前节点配置"
                onCancel={ this.hide }
                footer={
                    [
                        <Button
                            onClick={ this.hide }
                            key="cancel"
                        >取消
                        </Button>,
                        <Button
                            onClick={ this.handleSubmit }
                            type="primary"
                            key="submit"
                        >提交
                        </Button>
                    ]
                }
            >
                <Form>
                    <Form.Item
                        label="业务线"
                        { ...formItemLayout }
                        required={ true }
                    >
                        {
                            getFieldDecorator('businessId', {
                                rules: [{ required: true, message: '请选择业务线!' }],
                                initialValue: isQueryDataEmpty ? '' : this.state.queryData['businessId']
                            })(
                                <Select placeholder="请选择业务线" >
                                    {
                                        window['businessOptionsData'].map((item) => {
                                            return (
                                                <Select.Option
                                                    value={ item.value }
                                                    key={ item.value }
                                                >
                                                    { item.name }
                                                </Select.Option>
                                            );
                                        })
                                    }
                                </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="名称"
                        { ...formItemLayout }
                        required={ true }
                    >
                        {
                            getFieldDecorator('name', {
                                rules: [{ required: true, message: '请填写名称!' }],
                                initialValue:
                                    isQueryDataEmpty
                                    ?
                                    ''
                                    :
                                    this.state.queryData['name']
                            })(
                                <Input placeholder="请填写名称" />
                            )
                        }
                    </Form.Item>
                    <h3 style={ {textAlign: 'center'} }>配置信息</h3>
                    <Tabs
                        activeKey={ this.state.activeKey }
                        onChange={ this.tabsCallback }
                        className={ style.tabs }
                    >
                        <Tabs.TabPane tab="srm" key="srm">
                            <Form.Item
                                label="组织"
                                { ...formItemLayout }
                            >
                                {
                                    getFieldDecorator('organization', {
                                        initialValue:
                                        isQueryDataEmpty
                                        ?
                                        ''
                                        :
                                        this.state.queryData['srm']['organization']
                                    })(
                                        <Input placeholder="例如：china" />
                                    )
                                }
                            </Form.Item>
                            <h4 style={ {textAlign: 'center', marginTop: -19} }>Router</h4>
                            <div className={ style.router }>
                                { !!Object.keys(this.state.queryData).length && this.executeFormItems() }
                                { this.addFormItems() }
                                <Row className={ style.routerButton }>
                                    <Button type="dashed" icon="plus" onClick={ this.add }>新增</Button>
                                </Row>
                            </div>
                            <h4 style={ {textAlign: 'center', marginTop: 7} }>InRouter</h4>
                            <Form.Item
                                label="API列表"
                                { ...formItemLayout }
                            >
                                {
                                    getFieldDecorator('inRouter', {
                                        initialValue:
                                        isQueryDataEmpty
                                        ?
                                        ''
                                        :
                                        this.state.queryData['srm']['inRouter'].join('\n')
                                    })(
                                        <Input.TextArea placeholder="请填写接口" rows={ 2 }/>
                                    )
                                }
                            </Form.Item>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="odinMetric" key="odinMetric">
                            <div className={ style.odinMetric }>
                                { !!Object.keys(this.state.queryData).length && this.executeMetricItems() }
                                { this.addMetricItems() }
                                <Row className={ style.metricButton }>
                                    <Button type="dashed" icon="plus" onClick={ this.addMetric }>新增</Button>
                                </Row>
                            </div>
                        </Tabs.TabPane>
                    </Tabs>
                </Form>
            </Modal>
        );
    }
}
export default Form.create()(ServiceModule);
