import React from 'react';

export interface IViewProps<T> {
    model: T;

    [index: string]: any;
}

export abstract class AView<T> extends React.Component<IViewProps<T>, any> {
    public model: T;

    constructor(props, context) {
        super(props, context);
        this.model = props.model; // 1、props.model = this.model.modelTestConfigSH.headers
    }
}
