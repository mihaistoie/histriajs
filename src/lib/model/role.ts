import { ObservableObject } from './interfaces';
import { ModelManager } from './model-manager';

export class Role<T extends ObservableObject> {
    protected _value: T;
    protected _relation: any;
    protected _propertyName: any;
    protected _parent: ObservableObject;
    protected _refClass: any;

    constructor(parent: ObservableObject, propertyName: string, relation: any) {
        let that = this;
        that._propertyName = propertyName;
        that._relation = relation;
        that._parent = parent;
        that._refClass = new ModelManager().classByName(that._relation.model,that._relation.nameSpace);
    }
    public internalSetValue(value: T) {
         this._value = value;
    }
    public invRole(instance: any): any {
        let that = this;
        if (instance && that._relation && that._relation.invRel) {
            return  instance._children[that._relation.invRel];
        }
    }

    public async value(value?: T): Promise<T> {
        let that = this;
        if (value === undefined)
            return that._getValue();
        else
            return that._setValue(value);
    }
    protected async _getValue(): Promise<T> {
        let that = this;
        return Promise.resolve(that._value);
    }
    protected async _setValue(value: T): Promise<T> {
        return Promise.resolve(null);
    }
    
    public destroy() {
        let that = this;
        that._relation = null;
        that._parent = null;
        that._refClass = null;
        that._value = null;
    }
}
