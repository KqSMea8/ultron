import React from 'react';
import echarts from 'echarts';

interface IProps {
    data: any;
    height?: number;

    onClick?(evt: any): void;

    [index: string]: any;
}

export default abstract class AEChart extends React.Component<IProps, {}> {
    private chartElement: HTMLDivElement | undefined;
    private chartInstance?: echarts.ECharts;

    constructor(props: any, context?: any) {
        super(props, context);

        this.setChartContainer = this.setChartContainer.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    public componentDidMount(): void {
        this.executeECharts(this.props.data || []);
        window.addEventListener('resize', this.onResize);
    }

    public componentWillUnmount(): void {
        window.removeEventListener('resize', this.onResize);
        this.chartInstance && this.chartInstance.dispose();
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.data !== this.props.data) {
            this.executeECharts(nextProps.data || []);
        }
    }

    public render(): React.ReactNode {
        return (
            <div style={ { height: this.props.height || 240 } } ref={ this.setChartContainer }/>
        );
    }

    /**
     * 设置chart容器节点对象。
     * @param {HTMLDivElement} divElement
     */
    private setChartContainer(divElement: HTMLDivElement): void {
        this.chartElement = divElement;
    }

    private onResize(): void {
        this.chartInstance && this.chartInstance.resize();
    }

    /**
     * ECharts
     */
    private executeECharts(data: any): void {
        if (!this.chartInstance && this.chartElement) {
            this.chartInstance = echarts.init(this.chartElement);
            this.chartInstance.on('click', (conf) => {
                this.props.onClick && this.props.onClick(conf);
            });
        }
        if (this.chartInstance) {
            this.chartInstance.showLoading();
            this.chartInstance.setOption(this.dataToEChartOption(data));
            this.chartInstance.hideLoading();
        }
    }

    /**
     * 获取ECharts配置
     */
    protected abstract dataToEChartOption(data: any): echarts.EChartOption;
}

export class EChartSimple extends AEChart {
    protected dataToEChartOption(data: any): echarts.EChartOption {
        return data as echarts.EChartOption;
    }
}
