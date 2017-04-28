import { ObservableObject, ObservableArray, EventInfo, ObjectStatus, MessageServerity, UserContext, TransactionContainer, EventType, FindOptions } from '../interfaces';
import { ObjectArray, BaseObjectArray } from './base-array';
import { schemaUtils } from 'histria-utils';
import { DEFAULT_PARENT_NAME } from 'histria-utils';


export class HasManyComposition<T extends ObservableObject> extends ObjectArray<T> {
    constructor(parent: ObservableObject, propertyName: string, relation: any, model: any[]) {
        super(parent, propertyName, relation, model);
        const that = this;
        const isRestore = that._parent.status === ObjectStatus.restoring;
        if (!that._isNull && !that._isUndefined) {
            let pmodel = that._parent.model();
            that._items = new Array(model.length);
            that._model.forEach((itemModel: any, index: number) => {
                let item = that._parent.transaction.createInstance<T>(that._refClass, that._parent, that._propertyName, itemModel, isRestore);
                that._items[index] = item;
                if (!isRestore)
                    schemaUtils.updateRoleRefs(that._relation, itemModel, pmodel, true);
            })
        }
    }
    public enumChildren(cb: (value: ObservableObject) => void, recursive: boolean) {
        let that = this;
        that._items && that._items.forEach(item => {
            if (recursive) item.enumChildren(cb, true);
            cb(item)
        });
    }
    private async _removed(item: T, notifyRemove: boolean): Promise<void> {
        const that = this;
        const lmodel = item.model();
        schemaUtils.updateRoleRefs(that._relation, lmodel, null, true);
        await item.changeParent(null, that._propertyName, that._relation.invRel || DEFAULT_PARENT_NAME, true);
        if (notifyRemove)
            await that._parent.notifyOperation(that._propertyName, EventType.removeItem, item);

    }
    private async _added(item: T, notifyAdd: boolean): Promise<void> {
        const that = this;
        const lmodel = item.model();
        const rmodel = that._parent.model();
        schemaUtils.updateRoleRefs(that._relation, lmodel, rmodel, true);
        await item.changeParent(that._parent, that._propertyName, that._relation.invRel || DEFAULT_PARENT_NAME, true);
        if (notifyAdd)
            await that._parent.notifyOperation(that._propertyName, EventType.addItem, item);

    }
    protected async _afterRemoveItem(item: T, ii: number): Promise<void> {
        const that = this;
        that._model.splice(ii, 1);
        if (!that._model.length) {
            that._model = null;
            that._parent.model()[that._propertyName] = that._model;
        }
        if (item)
            await that._removed(item, true);
        that._isNull = (that._model === null);
    }
    protected async _afterAddItem(item: T): Promise<void> {
        const that = this;
        await that._added(item, true);

    }
    public async set(items: T[]): Promise<void> {
        const that = this;
        await that.lazyLoad();
        for (const item of that._items) {
            await that._removed(item, false);
        }
        that._items = [];
        if (items && items.length) {
            that._model = [];
            for (let item of items) {
                let imodel = item.model();
                that._model.push(imodel);
                that._items.push(item);
                await that._added(item, false);
            }

        } else {
            that._model = null
        }
        that._isNull = (that._model === null);
        that._parent.model()[that._propertyName] = that._model;
        await that._parent.notifyOperation(that._propertyName, EventType.setItems, null);
    }

    protected async lazyLoad(): Promise<void> {
        const that = this;
        if (!that._parent) return;
        if (that._isUndefined) {
            const lmodel = that._parent.model();
            const query = schemaUtils.roleToQuery(that._relation, lmodel)
            if (query) {
                const opts: FindOptions = { onlyInCache: that._parent.isNew };
                const items = await that._parent.transaction.find<T>(that._refClass, query, opts);
                if (items.length) {
                    that._model = new Array(items.length);
                    that._items = new Array(items.length);
                    for (let index = 0; index < items.length; index++) {
                        let item = items[index];
                        let model = item.model();
                        that._model[index] = model;
                        that._items[index] = item;
                        await item.changeParent(that._parent, that._propertyName, that._relation.invRel || DEFAULT_PARENT_NAME, false);
                    }
                } else
                    that._model = null;
            } else
                that._model = null;
            that._isUndefined = false;
            that._isNull = that._model === null;
            lmodel[that._propertyName] = that._model;
        }

    }
    public destroy() {
        const that = this;
        that._items && that._items.forEach(item => {
            item.destroy();
        });
        that._items = null;
        super.destroy();
    }


}

export class HasManyAggregation<T extends ObservableObject> extends BaseObjectArray<T> {
    private _loaded: boolean;

    protected async _afterRemoveItem(item: T, ii: number): Promise<void> {
        const that = this;
        if (item) {
            const lmodel = item.model();
            schemaUtils.updateRoleRefs(that._relation, lmodel, null, true);
            let r = item.getRoleByName(that._relation.invRel, );
            if (r) await r.internalSetValueAndNotify(null, item);
            await that._parent.notifyOperation(that._propertyName, EventType.removeItem, item);
        }
    }
    protected async _afterAddItem(item: T): Promise<void> {
        const that = this;
        const lmodel = item.model();
        const rmodel = that._parent.model();
        const r = item.getRoleByName(that._relation.invRel);
        if (r) await r.internalSetValueAndNotify(that._parent, item);
        await that._parent.notifyOperation(that._propertyName, EventType.addItem, item);

    }

    public async set(items: T[]): Promise<void> {
        const that = this;
        await that.lazyLoad();
        while (that._items && that._items.length)
            await that.remove(0);
        if (items) {
            for (let item of items)
                await that.add(item);
        }
    }

    protected async lazyLoad(): Promise<void> {
        const that = this;
        if (!that._parent) return;
        if (!that._loaded) {
            that._loaded = true;
            const query = schemaUtils.roleToQuery(that._relation, that._parent.model());
            if (query) {
                const opts: FindOptions = { onlyInCache: false };
                const items = await that._parent.transaction.find<T>(that._refClass, query);
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
    private async _updateInvSideAfterLazyLoading(newValue: T): Promise<void> {
        // After lazy loading
        const that = this;
        if (newValue) {
            // roleInv is AggregationBelongsTo
            const roleInv = newValue.getRoleByName(that._relation.invRel);
            if (roleInv) roleInv.internalSetValue(that._parent);
        }
    }
}


export class HasManyRefObject<T extends ObservableObject> extends ObjectArray<T> {
    async length(): Promise<number> {
        const that = this;
        await that.lazyLoad();
        return that._items ? that._items.length : 0;
    }
}
