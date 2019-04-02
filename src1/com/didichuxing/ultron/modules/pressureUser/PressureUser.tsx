import ModelPressureUser from '@ultron/modules/pressureUser/ModelPressureUser';
import {AModule} from 'com/didichuxing/commonInterface/AModule';
import React from 'react';
import { observer } from 'mobx-react';
import { Bind } from 'lodash-decorators';
import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';
import Layout from '@antd/layout';
import Button from '@antd/button';
import Input from '@antd/input';
import Table from '@antd/table';
import SubMenu from '@ultron/modules/tool/SubMenu';
import style from './PressureUser.less';

const { Sider } = Layout;
const ObsSearchInput = bindObserver(Input, 'searchNumber', 'value');

@observer
export default class PressureUser extends AModule<ModelPressureUser> {
    private COL_SETTINGS = [
        {title: '类型', dataIndex: 'vType', key: 'vType'},
        {title: '地区', dataIndex: 'vRegion', key: 'vRegion'},
        {title: 'uid', dataIndex: 'vUid', key: 'vUid'},
        {title: '手机号', dataIndex: 'vPhone', key: 'vPhone'},
        {title: '业务线', dataIndex: 'vBusiness', key: 'vBusiness'},
        {title: '城市', dataIndex: 'vCity', key: 'vCity'}
    ];
    protected createModel(): ModelPressureUser {
        return new ModelPressureUser(this.query);
    }

    @Bind()
    private pushTo(key: string): void {
        this.push({ url: key });
    }

    /**
     * 输入UID或者手机号绑定事件
     * @param evt
     */
    @Bind()
    public searchInput(evt): void {
        this.model.list = [];
        this.model.searchInput(evt.target.value);
    }

    /**
     * 绑定查询按钮事件
     */
    @Bind()
    public search(): void {
        this.model.list = [];
        this.model.searchData();
    }
    private renderTable(): React.ReactNode {
        return (
            <Table
                columns={ this.COL_SETTINGS }
                bordered={ true }
                dataSource={ this.model.list }
                pagination={ false }
            />
        );
    }

    public render(): React.ReactNode {
        return (
            <div>
                <div className={ style.detailLeft }>
                    <Layout>
                        <Sider>
                            <SubMenu pushTo={ this.pushTo }/>
                        </Sider>
                    </Layout>
                </div>
                <div className={ style.detailRight }>
                    <div className={ style.pressureUser }>压测用户</div>
                    <div>
                        <ObsSearchInput
                            model={ this.model }
                            onChange={ this.searchInput }
                            className={ style.searchInputNumber }
                            placeholder="请输入UID或者手机号"
                        />
                        <Button
                            type="primary"
                            style={ { marginLeft: '15px'} }
                            onClick={ this.search }
                        >查询
                        </Button>
                    </div>
                    <div className={ style.table }>
                        { this.model.list.length > 0 ? this.renderTable() : null }
                    </div>
                </div>
            </div>
        );
    }
}
