import { ObservableObject } from './interfaces';
import { Role } from './role';
import { AGGREGATION_KIND } from '../schema/schema-consts';
import { updateRoleRefs } from '../schema/schema-utils';





export class BaseBelongsTo<T extends ObservableObject> extends Role<T> {
    protected _value: T;

    constructor(parent: ObservableObject, propertyName: string, relation: any) {
        super(parent, propertyName, relation);

    }
    protected async _lazyLoad(): Promise<T> {
        let that = this;
        let lmodel = that._parent.model();
        let query: any = {}, valueIsNull = false;
        that._relation.foreignFields.forEach((field, index) => {
            let ff = that._relation.localFields[index];
            let value = lmodel[ff];
            if (value === null || value === '' || value === undefined)
                valueIsNull = true;
            else
                query[field] = value;
        });
        let res = null;
        if (!valueIsNull)
            res = await that._parent.transaction.findOne<T>(query, that._refClass);
        return res || null;
    }
    public destroy() {
        let that = this;
        that._value = null;
        super.destroy();
    }
}

export class AggregationBelongsTo<T extends ObservableObject> extends BaseBelongsTo<T> {
    protected async _getValue(): Promise<T> {
        let that = this;
        let res: any = that._value;
        if (res === undefined) {
            res = await that._lazyLoad() || null;
            that._value = res;
            //TODO: update side
            //that._updateInvSide()
        }
        return res;
    }
    protected async _setValue(value: T): Promise<T> {
        let that = this;
        let oldValue: any = that._value;
        let newValue: any = value;
        if (oldValue === newValue)
            return oldValue;
        let changeParentCalled = false;
        if (that._relation.invRel) {
            if (oldValue && oldValue.removeChild) {
                changeParentCalled = true;
                await oldValue.removeChild(that._relation.invRel, that._parent);
            }
            if (newValue && newValue.addChild) {
                changeParentCalled = true;
                await newValue.addChild(that._relation.invRel, that._parent);
            }
        }
        if (!changeParentCalled) {
            let p: any = that._parent;
            updateRoleRefs(that._relation, that._parent.model(), newValue ? newValue.model() : null, false);
            await p.changeParent(newValue, that._propertyName, true);
        }
        let res: any = that._parent.parent;
        return res;
    }    

}

export class CompositionBelongsTo<T extends ObservableObject> extends BaseBelongsTo<T> {
    protected async _getValue(): Promise<T> {
        let that = this;
        let res: any = that._parent.parent;
        if (res === undefined) {
            res = await that._lazyLoad() || null;
            let p: any = that._parent;
            await p.changeParent(res, that._propertyName, false);
            let refRole = that.invRole(res);
            if (refRole) 
                refRole.internalSetValue(that._parent);
        }
        return res;
    }
    protected async _setValue(value: T): Promise<T> {
        let that = this;
        let oldParent: any = await that._getValue();
        let newParent: any = value;
        if (oldParent === newParent)
            return oldParent;
        let changeParentCalled = false;
        if (that._relation.invRel) {
            if (oldParent && oldParent.removeChild) {
                changeParentCalled = true;
                await oldParent.removeChild(that._relation.invRel, that._parent);
            }
            if (newParent && newParent.addChild) {
                changeParentCalled = true;
                await newParent.addChild(that._relation.invRel, that._parent);
            }
        }
        if (!changeParentCalled) {
            let p: any = that._parent;
            updateRoleRefs(that._relation, that._parent.model(), newParent ? newParent.model() : null, false);
            await p.changeParent(newParent, that._propertyName, true);
        }
        let res: any = that._parent.parent;
        return res;
    }

}

