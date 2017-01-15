import { ObservableObject, ObservableArray, EventInfo, ObjectStatus, MessageServerity, UserContext, TransactionContainer, EventType } from './interfaces';
import { ObjectArray, BaseObjectArray } from './base-array';
import { updateRoleRefs } from '../schema/schema-utils';
import { DEFAULT_PARENT_NAME } from '../schema/schema-consts';

export class HasManyComposition<T extends ObservableObject> extends ObjectArray<T> {

    public async remove(element: T | number): Promise<T> {
        let that = this;
        await that.lazyLoad();
        let ii: number, item: T;
        if (typeof element === 'number') {
            ii = <number>element;
            if (ii >= 0 && ii < that._items.length) {
                item = that._items[ii];
            } else {
                ii = -1;
                item = null;
            }
        } else {
            item = <T>element;
            ii = that._items.indexOf(item);
            if (ii < 0)
                item = null;
        }
        if (!item) return null;
        that._items.splice(ii, 1);
        that._model.splice(ii, 1);
        if (!that._model.length) {
            that._model = null;
            that._parent.model()[that._propertyName] = that._model;
        }
        if (item) {
            let lmodel = item.model();
            updateRoleRefs(that._relation, lmodel, null, true);
            await item.changeParent(null, that._relation.invRel || DEFAULT_PARENT_NAME, true);
        }
        that._isNull = (that._model === null);
        return item;
    }
    public async add(item: T, index?: number): Promise<T> {
        let that = this;
        if (!item) return;
        await that.lazyLoad();
        if (that._items.indexOf(item) >= 0)
            return item;
        if (index === undefined || (index < 0 && index >= that._items.length))
            index = -1;
        if (!that._model) {
            that._model = [];
            that._isNull = false;
            that._parent.model()[that._propertyName] = that._model;
        }
        let imodel = item.model();
        if (index >= 0) {
            that._items.splice(index, 0, item);
            that._model.splice(index, 0, imodel);
        } else {
            that._items.push(item);
            that._model.push(that._model);
        }
        if (item) {
            let lmodel = item.model();
            let rmodel = that._parent.model();
            updateRoleRefs(that._relation, lmodel, rmodel, true);
            await item.changeParent(that._parent, that._relation.invRel || DEFAULT_PARENT_NAME, true);
        }
        return item;
    }

    protected async lazyLoad(): Promise<void> {
        let that = this;
        if (!that._parent) return;
        if (that._isUndefined) {
            let lmodel = that._parent.model();
            let query: any = {}, valueIsNull = false;
            that._relation.localFields.forEach((field, index) => {
                let ff = that._relation.foreignFields[index];
                let value = lmodel[field];
                if (value === null || value === '' || value === undefined)
                    valueIsNull = true;
                else
                    query[ff] = value;
            });
            if (valueIsNull) {
                that._model = null;
            } else {
                let items = await that._parent.transaction.find<T>(query, that._refClass);
                if (items.length) {
                    that._model = new Array(items.length);
                    that._items = new Array(items.length);
                    for (let index = 0; index < items.length; index++) {
                        let item = items[index];
                        let model = item.model();
                        that._model[index] = model;
                        that._items[index] = item;
                        await item.changeParent(that._parent, that._relation.invRel || DEFAULT_PARENT_NAME, false);
                    }
                } else
                    that._model = null;
            }
            that._isUndefined = false;
            that._isNull = that._model === null;
            lmodel[that._propertyName] = that._model;
        }

    }

}

export class HasManyAggregation<T extends ObservableObject> extends BaseObjectArray<T> {
    private _loaded: boolean;
    public async remove(element: T | number): Promise<T> {
        let that = this;
        await that.lazyLoad();
        let ii: number, item: T;
        if (typeof element === 'number') {
            ii = <number>element;
            if (ii >= 0 && ii < that._items.length) {
                item = that._items[ii];
            } else {
                ii = -1;
                item = null;
            }
        } else {
            item = <T>element;
            ii = that._items.indexOf(item);
            if (ii < 0)
                item = null;
        }
        if (!item) return null;
        that._items.splice(ii, 1);
        if (item) {
            let lmodel = item.model();
            updateRoleRefs(that._relation, lmodel, null, true);
            let r = item.getRoleByName(that._relation.invRel, );
            if (r) await r.internalSetValueAndNotify(null, item);
        }
        return item;
    }
    public async add(item: T, index?: number): Promise<T> {
        let that = this;
        if (!item) return;
        await that.lazyLoad();
        if (that._items.indexOf(item) >= 0)
            return item;
        if (index === undefined || (index < 0 && index >= that._items.length))
            index = -1;
        if (index >= 0)
            that._items.splice(index, 0, item);
        else
            that._items.push(item);
        if (item) {
            let lmodel = item.model();
            let rmodel = that._parent.model();
            let r = item.getRoleByName(that._relation.invRel);
            if (r) await r.internalSetValueAndNotify(that._parent, item);
            
            updateRoleRefs(that._relation, lmodel, rmodel, true);
            await item.changeParent(that._parent, that._relation.invRel, true);
        }
        return item;
    }
    protected async lazyLoad(): Promise<void> {
        let that = this;
        if (!that._parent) return;
        if (!that._loaded) {
            that._loaded = true;
            let lmodel = that._parent.model();
            let query: any = {}, valueIsNull = false;
            that._relation.localFields.forEach((field, index) => {
                let ff = that._relation.foreignFields[index];
                let value = lmodel[field];
                if (value === null || value === '' || value === undefined)
                    valueIsNull = true;
                else
                    query[ff] = value;
            });
            if (!valueIsNull) {
                let items = await that._parent.transaction.find<T>(query, that._refClass);
                if (items.length) {
                    that._items = new Array(items.length);
                    for (let index = 0; index < items.length; index++) {
                        let item = items[index];
                        that._items[index] = item;
                        await that._updateInvSideAfterLazyLoading(item);
                    }
                }
            }
        }

    }

    protected async _updateInvSideAfterLazyLoading(newValue: T): Promise<void> {
        //after lazy loading
        let that = this;
        if (newValue) {
            //roleInv is AggregationBelongsTo
            let roleInv = newValue.getRoleByName(that._relation.invRel);
            if (roleInv) roleInv.internalSetValue(that._parent);

        }

    }

}