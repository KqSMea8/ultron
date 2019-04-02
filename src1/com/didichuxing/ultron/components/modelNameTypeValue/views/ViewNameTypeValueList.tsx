import React from 'react';
import { AView } from 'com/didichuxing/commonInterface/AView';
import ModelNameTypeValueList from 'com/didichuxing/ultron/components/modelNameTypeValue/models/ModelNameTypeValueList';

import ViewNameTypeValue from 'com/didichuxing/ultron/components/modelNameTypeValue/views/ViewNameTypeValue';

import { observer } from 'mobx-react';

@observer
export default class ViewNameTypeValueList extends AView<ModelNameTypeValueList> {
    public render(): React.ReactNode {
        return (
            <div>
                {
                    this.model.getList().map((it, index) => {
                        return <ViewNameTypeValue key={ it.key } model={ it } index={ index } />;
                    })
                }
            </div>
        );
    }
}
