import React from 'react';

export default class Rewrite extends React.Component<any, any> {

    public componentDidMount(): void {
        if (location.pathname.indexOf('/rewrite-new.html') === 0) {
            this.props.history.replace({ pathname: location.pathname.replace('rewrite-', '') });
        } else if (location.pathname.indexOf('/rewrite-') === 0) {
            location.href = location.pathname.replace('rewrite-', '');
        }
    }

    public render(): React.ReactNode {
        return null;
    }
}
