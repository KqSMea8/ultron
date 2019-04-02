export interface IParams {
    type: string; // "http"
}

export interface IReturnItem {
    name: string; // "公交"
    value: string; // "4"
}

export interface IReturn extends Array<IReturnItem> {}
