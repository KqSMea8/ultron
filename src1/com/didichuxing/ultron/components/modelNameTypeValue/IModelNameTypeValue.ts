/**
 * 名称/值
 */
export interface IModelNameTypeValue<T> {
    name?: string;
    value?: T;
    type?: string;
    typeName?: string;
    placeholderPrefix?: string;
    showButton?: boolean;

    onAdd?(): void;
    onDelete?(): void;
}

/**
 * 名称/值列表
 */
export interface IModelNameTypeValueList<T> {
    /**
     * 获取列表
     * @returns {T[]} 对象数组
     */
    getList(): T[];

    /**
     * 新增一项
     * @param {T} item
     * @returns {number} 新增对象的索引值
     */
    add(item: T): number;

    /**
     * 通过项删除
     * @param {T} item
     * @returns {boolean} 是否删除成功
     */
    deleteByItem(item: T): boolean;

    /**
     * 通过索引删除
     * @param {number} index
     * @returns {boolean} 是否删除成功
     */
    deleteByIndex(index: number): boolean;

    /**
     * 通过项获取索引
     * @param {T} item
     * @returns {number} 对象的索引值，-1表示未找到
     */
    findIndexByItem(item: T): number;
}
