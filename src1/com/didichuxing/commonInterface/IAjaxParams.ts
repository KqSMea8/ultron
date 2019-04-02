export interface IAjaxParams<P> {
    getAjaxParams(): P | Promise<P>;
}
