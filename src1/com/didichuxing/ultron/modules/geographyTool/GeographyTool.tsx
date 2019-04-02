import ModelGeographyTool from '@ultron/modules/geographyTool/ModelGeographyTool';
import { AModule } from 'com/didichuxing/commonInterface/AModule';
import React from 'react';
import { observer } from 'mobx-react';
import { Bind } from 'lodash-decorators';
import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';
import DDMap from '@ultron/components/map/DDMap';
import { Map, Markers, InfoWindow } from 'react-amap';

import Layout from '@antd/layout';
import Button from '@antd/button';
import Input from '@antd/input';
import Radio from '@antd/radio';
import Row from '@antd/row';
import Col from '@antd/col';
import Icon from '@antd/icon';

import SubMenu from '@ultron/modules/tool/SubMenu';
import style from './GeographyTool.less';

const { Sider } = Layout;
const RadioGroup = Radio.Group;

const ObsStart = bindObserver(Input, 'fromAry', 'value');
const ObsEnd = bindObserver(Input, 'destAry', 'value');
const ObsCountrySetting = bindObserver(RadioGroup, 'countryType', 'value');

const wid = {
    width: '66.7%',
    height: '320px',
    marginTop: '15px',
    marginBottom: '15px'
};

@observer
export default class GeographyTool extends AModule<ModelGeographyTool> {
    protected createModel(): ModelGeographyTool {
        return new ModelGeographyTool(this.query);
    }

    @Bind()
    private pushTo(key: string): void {
        this.push({ url: key });
    }

    /**
     * 起点事件
     * @param evt
     */
    @Bind()
    public start(evt): void {
        this.model.setFromAry(evt.target.value);
    }

    /**
     * 终点事件
     * @param evt
     */
    @Bind()
    public end(evt): void {
        this.model.setDestAry(evt.target.value);
    }

    /**
     * 计算按钮事件
     */
    @Bind()
    public compute(): void {
        this.model.compute();
    }

    /**
     * 国家的选择
     * @param evt
     */
    @Bind()
    public onChangeSetting(evt): void {
        this.model.setCountryType(evt.target.value);
    }

    /**
     * 中国偏移传值
     * @param evt
     */
    @Bind()
    private setChinaLeft(evt): void {
        this.model.setChinaLeft(evt.target.value);
    }

    /**
     * 巴西偏移传值
     * @param evt
     */
    @Bind()
    private setBrazilLeft(evt): void {
        this.model.setBrazilLeft(evt.target.value);
    }

    /**
     * 中国还原传值
     * @param evt
     */
    @Bind()
    private setChinaRight(evt): void {
        this.model.setChinaRight(evt.target.value);
    }

    /**
     * 巴西还原传值
     * @param evt
     */
    @Bind()
    private setBrazilRight(evt): void {
        this.model.setBrazilRight(evt.target.value);
    }

    /**
     * 偏移事件
     */
    @Bind()
    private setSkewing(): void {
        this.model.setSkewing();
    }

    /**
     * 还原事件
     */
    @Bind()
    private setBack(): void {
        this.model.setBack();
    }

    public marketClick = {
        click: (e) => {
            this.model.isShow = true;
            this.model.infoWindowPos = {
                longitude: e.lnglat.lng,
                latitude: e.lnglat.lat
            };
        }
    };
    public close = {
        close: () => {
            this.model.isShow = false;
        }
    };
    /**
     * 巴西market点击事件
     * @type {{click: ((e)=>any)}}
     */
    public marketClicks = {
        click: (e) => {
            this.model.isShows = true;
            this.model.infoWindowPoss = {
                longitude: e.lnglat.lng,
                latitude: e.lnglat.lat
            };
        }
    };
    /**
     * 巴西market点击关闭事件
     * @type {{close: (()=>any)}}
     */
    public closes = {
        close: () => {
            this.model.isShows = false;
        }
    };

    private renderSetting(): React.ReactNode {
        const countryType = this.model.countryType;
        if (countryType === 'China') {
            const infoWindowPos: any = this.model.infoWindowPos;
            const html = `
                <div>
                    <p>经度：${ infoWindowPos.longitude }</p>
                    <p>纬度：${ infoWindowPos.latitude }</p>
                </div>
            `;
            const plugins: any = ['Scale', {
                name: 'ToolBar',
                options: {
                    ruler: true,
                    liteStyle: false,
                    position: 'LT'
                }
            }];
            return (
                <div style={ { marginTop: '10px' } }>
                    <Row>
                        <Col span={ 6 }>
                            <Input.TextArea
                                className={ style.textArea }
                                onChange={ this.setChinaLeft }
                                value={ this.model.chinaLeft }
                                placeholder="116.407718,39.961848"
                            />
                        </Col>
                        <Col span={ 4 }>
                            <Row style={ { textAlign: 'center', marginTop: '11px' } }>
                                <Button
                                    type="primary"
                                    style={ { width: '120px' } }
                                    onClick={ this.setSkewing }
                                >
                                    偏移
                                    <Icon type="double-right"/>
                                </Button>
                            </Row>
                            <Row style={ { textAlign: 'center', marginTop: '13px' } }>
                                <Button
                                    type="primary"
                                    style={ { width: '120px' } }
                                    onClick={ this.setBack }
                                >
                                    <Icon type="double-left"/>
                                    还原
                                </Button>
                            </Row>
                        </Col>
                        <Col span={ 6 }>
                            <Input.TextArea
                                className={ style.textArea }
                                onChange={ this.setChinaRight }
                                value={ this.model.chinaRight }
                                placeholder="-114.80078,-21.63827"
                            />
                        </Col>
                    </Row>
                    {
                        this.model.objArray.length > 0 ? (
                            <div>
                                <div style={ wid }>
                                    <Map
                                        amapkey={ '788e08def03f95c670944fe2c78fa76f' }
                                        scrollWheel={ false }
                                        zoom={ 3 }
                                        center={ this.model.objArray[0].position }
                                        plugins={ plugins }
                                    >
                                        <Markers
                                            markers={ this.model.objArray }
                                            events={ this.marketClick }
                                        />
                                        <InfoWindow
                                            size={ { width: 200, height: 100 } }
                                            position={ this.model.infoWindowPos as any }
                                            isCustom={ false }
                                            visible={ this.model.isShow }
                                            events={ this.close }
                                            content={ html }
                                        />
                                    </Map>
                                </div>
                            </div>
                        ) : null
                    }
                </div>
            );
        } else {
            const infoWindowPoss: any = this.model.infoWindowPoss;
            const html = `
                <div>
                    <p>经度：${ infoWindowPoss.longitude }</p>
                    <p>纬度：${ infoWindowPoss.latitude }</p>
                </div>
            `;
            const plugins: any = ['Scale', {
                name: 'ToolBar',
                options: {
                    ruler: true,
                    liteStyle: false,
                    position: 'LT'
                }
            }];
            return (
                <div style={ { marginTop: '10px' } }>
                    <Row>
                        <Col span={ 6 }>
                            <Input.TextArea
                                className={ style.textArea }
                                onChange={ this.setBrazilLeft }
                                value={ this.model.brazilLeft }
                                placeholder="116.407718,39.961848"
                            />
                        </Col>
                        <Col span={ 4 }>
                            <Row style={ { textAlign: 'center', marginTop: '11px' } }>
                                <Button
                                    type="primary"
                                    style={ { width: '120px' } }
                                    onClick={ this.setSkewing }
                                >
                                    偏移
                                    <Icon type="double-right"/>
                                </Button>
                            </Row>
                            <Row style={ { textAlign: 'center', marginTop: '13px' } }>
                                <Button
                                    type="primary"
                                    style={ { width: '120px' } }
                                    onClick={ this.setBack }
                                >
                                    <Icon type="double-left"/>
                                    还原
                                </Button>
                            </Row>
                        </Col>
                        <Col span={ 6 }>
                            <Input.TextArea
                                className={ style.textArea }
                                onChange={ this.setBrazilRight }
                                value={ this.model.brazilRight }
                                placeholder="-114.80078,-21.63827"
                            />
                        </Col>
                    </Row>
                    {
                        this.model.objArrays.length > 0 ? (
                            <div>
                                <div style={ wid }>
                                    <Map
                                        amapkey={ '788e08def03f95c670944fe2c78fa76f' }
                                        scrollWheel={ false }
                                        zoom={ 3 }
                                        center={ this.model.objArrays[0].position }
                                        plugins={ plugins }
                                    >
                                        <Markers
                                            markers={ this.model.objArrays }
                                            events={ this.marketClicks }
                                        />
                                        <InfoWindow
                                            size={ { width: 200, height: 100 } }
                                            position={ this.model.infoWindowPoss as any }
                                            isCustom={ false }
                                            visible={ this.model.isShows }
                                            events={ this.closes }
                                            content={ html }
                                        />
                                    </Map>
                                </div>
                            </div>
                        ) : null
                    }
                </div>
            );
        }
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
                    <div className={ style.geographyTool }>计算距离</div>
                    <div className={ style.startEnd }>
                        起点:
                        <ObsStart
                            model={ this.model }
                            onChange={ this.start }
                            className={ style.start }
                            placeholder="116.407718,39.961848"
                            onPressEnter={ null }
                        />
                        终点:
                        <ObsEnd
                            model={ this.model }
                            onChange={ this.end }
                            className={ style.end }
                            placeholder="116.407718,39.961848"
                            onPressEnter={ null }
                        />
                        <Button
                            type="primary"
                            onClick={ this.compute }
                            className={ style.compute }
                        >
                            计算
                        </Button>
                        <span style={ { marginLeft: '20px' } }>
                            { this.model.computeResult === '' ? null : this.model.computeResult + 'm' }
                        </span>
                    </div>
                    <div className={ style.geographyTools }>坐标偏移</div>
                    <div className={ style.skewing }>
                        <ObsCountrySetting
                            model={ this.model }
                            onChange={ this.onChangeSetting }
                            value={ String(this.model.countryType) }
                        >
                            <Radio value={ 'China' }>中国</Radio>
                            <Radio value={ 'Brazil' }>巴西</Radio>
                        </ObsCountrySetting>
                        { this.renderSetting() }
                    </div>
                </div>
            </div>
        );
    }
}
