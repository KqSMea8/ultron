import React from 'react';
import { Bind } from 'lodash-decorators';
import DataTransferComponent from 'com/didichuxing/components/DataTransferComponent';
import { Modal, Button, Skeleton, Input, Form, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { cqiDataGroupClusters, cqiDataGroupModule, cqiDataGroupCreate } from '@ultron/remote/plate';
import TreeNode from './treeNode/TreeNode';
import style from './EstablishDataGroup.less';
const formItemLayout = {
    labelCol: {span: 4, offset: 3},
    wrapperCol: { span: 12 }
};
interface IEstablishDataGroupProps extends FormComponentProps {
    isShowEstablishModal: boolean;
    hideEstablishModal();
    fatherFetchData();
}

interface IEstablishDataGroupState {
    spinLoading: boolean;
    loading: boolean;
    allCluster: any[];
    clusterData: any[];
    expandedKeys: string[];
    checkedKeys: string[];
}
class EstablishDataGroup extends DataTransferComponent<IEstablishDataGroupProps, IEstablishDataGroupState> {
    constructor(props: IEstablishDataGroupProps, context?: IEstablishDataGroupState) {
        super(props, context);
        this.state = {
            spinLoading: true,
            loading: false,
            allCluster: [],
            clusterData: [],
            expandedKeys: [],
            checkedKeys: []
        };
    }
    @Bind()
    private async fetchData() {
        const allCluster: any = await cqiDataGroupClusters({});

        this.setState({
            spinLoading: false,
            allCluster
        });
    }
    @Bind()
    private handleSubmit() {
        this.dispatch('@Ultron/TreeNode/getCheckedKeys', {});
    }
    @Bind()
    private keyDown(event: React.KeyboardEvent<HTMLFormElement>) {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    }
    /**
     *  获取到tree数据checkedKeys
     */
    @Bind()
    private getCheckedKeys(checkedKeys: string[]) {
        this.props.form.validateFieldsAndScroll((err, formData) => {
            if (!err) {
                const query: object = {
                    name: formData.name,
                    services: checkedKeys,
                    cluster: formData.cluster
                };
                cqiDataGroupCreate(query).then((resulet) => {
                    resulet && Modal.success({
                        title: '新建数据组成功',
                        onOk: () => {
                            this.hide();
                            this.props.fatherFetchData();
                        }
                      });
                });
            }
        });
    }
    @Bind()
    private hide() {
        this.props.hideEstablishModal();
    }
    public componentWillMount() {
        this.fetchData();
    }
    public render(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                visible={ this.props.isShowEstablishModal }
                width={ 800 }
                title="新建数据组"
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
                            loading={ this.state.loading }
                        >提交
                        </Button>
                    ]
                }
            >
                {
                    this.state.spinLoading ? <Skeleton active={ true }/> :
                    <Form onKeyDown={ this.keyDown } className={ style.establishDataGroup }>
                        <Form.Item
                            label="数据组名称"
                            { ...formItemLayout }
                            required={ true }
                        >
                            {
                                getFieldDecorator('name', {
                                    rules: [{ required: true, message: '请输入数据组名称!' }]
                                })(
                                    <Input placeholder="请输入数据组名称"/>
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            label="选择集群"
                            { ...formItemLayout }
                            required={ true }
                        >
                            {
                                getFieldDecorator('cluster', {
                                    rules: [{ required: true, message: '请选择集群!' }]
                                })(
                                    <Select placeholder="请选择集群" >
                                        {
                                            this.state.allCluster.map((cluster) => {
                                                return (
                                                    <Select.Option
                                                        value={ cluster }
                                                        key={ cluster }
                                                    >
                                                        { cluster }
                                                    </Select.Option>
                                                );
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            label="数据组"
                            { ...formItemLayout }
                            required={ true }
                        >
                            <TreeNode getCheckedKeys={ this.getCheckedKeys }/>
                        </Form.Item>
                    </Form>
                }
            </Modal>
        );
    }
}

export default Form.create()(EstablishDataGroup);
