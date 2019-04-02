/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The class of DataTransferComponent
 * Data transfer for each component.
 */

import React from 'react';
import { publish, subscribe, unsubscribe } from 'pubsub-js';

export type DataTransferReceiver<T> = (data: T) => void;

export default abstract class DataTransferComponent<P = {}, S = {}> extends React.Component<P, S> {

    /**
     * 已接收的topic队列
     */
    private receivedTopicQueue: any[];

    /**
     * @constructor
     * @param {P} props
     * @param context
     */
    constructor(props: P, context?: any) {
        super(props, context);
        this.receivedTopicQueue = [];
    }

    /**
     * dispatch the data as event.
     * @param {string} topicMessage
     */
    protected dispatch<T>(topicMessage: string, data: T): void {
        publish(topicMessage, data);
    }

    /**
     * 接收topic
     * @param {string} topicMessage
     * @param {DataTransferListener<T>} listener
     */
    protected receiveTopic<T>(topicMessage: string, receiver: DataTransferReceiver<T>): void {
        this.receivedTopicQueue.push(
            subscribe(topicMessage, (msg: string, data: T): void => { receiver.call(this, data); })
        );
    }

    /**
     * @override
     * @inheritDoc
     */
    public componentWillUnmount(): void {
        while (this.receivedTopicQueue.length) {
            const receivedTopic: any | undefined = this.receivedTopicQueue.pop();
            if (receivedTopic) {
                unsubscribe(receivedTopic);
            }
        }
    }
}
