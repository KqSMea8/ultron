import React from 'react';
import { IReactComponent, observer } from 'mobx-react';
import { IPlainObject } from 'com/didichuxing/IPlainObject';
import { runInAction } from 'mobx';

interface IPropsBindObserver {
    model: any;

    [index: string]: any;
}

export function bindObserver(Component: IReactComponent<any>,
                             modelFieldName: string,
                             attrName: string = 'value') {
    function addObsToReactComponent({ model, ...props }: IPropsBindObserver) {
        Object.assign(props, {
            [attrName]: model[modelFieldName]
        });
        Component = observer(Component);
        return <Component { ...props } />;
    }

    return observer(addObsToReactComponent);
}

// export interface IBindModelToInputProps extends IPlainObject {
//     onChange(evt: any);
//
//     value: any;
// }

// export interface IBindModelToInput {
//     Component: IReactComponent<IBindModelToInputProps>;
//     fieldName: string;
// }

// export function bindModelToInput(Component: any,
//                                  fieldName: string) {
//     function addModelToInput({ model, ...props }: IPropsBindObserver) {
//         Object.assign(props, {
//             value: model[fieldName],
//             onChange: (evt) => {
//                 runInAction(() => { model[fieldName] = evt.target ? evt.target.value : evt; });
//             }
//         });
//         Component = observer(Component);
//         return <Component { ...props } />;
//     }
//
//     return observer(addModelToInput);
// }
