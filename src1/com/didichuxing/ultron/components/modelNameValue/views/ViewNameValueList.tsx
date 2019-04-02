import React from 'react';
import { AView } from 'com/didichuxing/commonInterface/AView';
import ModelNameValueList from 'com/didichuxing/ultron/components/modelNameValue/models/ModelNameValueList';

import ViewNameValue from 'com/didichuxing/ultron/components/modelNameValue/views/ViewNameValue';

import { observer } from 'mobx-react';

@observer
export default class ViewNameValueList extends AView<ModelNameValueList> {
    public render(): React.ReactNode {
        return (
            <div>
                {
                    this.model.getList().map((it) => {
                        return <ViewNameValue key={ it.key } model={ it }/>;
                    })
                }
            </div>
        );
    }
}
