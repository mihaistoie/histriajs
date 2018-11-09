import { ObservableObject, FrameworkObject, EventInfo, ObjectStatus, MessageServerity, UserContext, TransactionContainer, EventType, ChangePropertyOptions } from './interfaces';
import { InstanceErrors } from './states/instance-errors';
import { InstanceState } from './states/instance-state';
import { BaseInstance } from './base-instance';
export declare class ModelObject extends BaseInstance implements ObservableObject, FrameworkObject {
    context: UserContext;
    transaction: TransactionContainer;
    protected _status: ObjectStatus;
    protected _parent: ObservableObject;
    protected _listeners: {
        listener: any;
        parent: ObservableObject;
        propertyName: string;
    }[];
    protected _loaded: any[];
    protected _children: any;
    protected _schema: any;
    private _cacheViewsOfMe;
    protected _rootCache: ObservableObject;
    private _afterCreateCalled;
    protected _model: any;
    protected _states: InstanceState;
    protected _errors: InstanceErrors;
    protected _propertyName: string;
    addListener(listener: any, parent: ObservableObject, propertyName: string): void;
    rmvListener(listener: any): void;
    getListeners(noParent: boolean): {
        instance: ObservableObject;
        propertyName: string;
        isOwner: boolean;
    }[];
    pushLoaded(cb: () => Promise<void>): void;
    getRoleByName(roleName: string): any;
    rmvObjectFromRole(roleName: string, instance: ObservableObject): Promise<void>;
    addObjectToRole(roleName: string, instance: ObservableObject): Promise<void>;
    changeParent(newParent: ObservableObject, foreignPropName: string, localPropName: string, notify: boolean): Promise<void>;
    readonly owner: ObservableObject;
    readonly uuid: string;
    readonly isPersistent: boolean;
    readonly isNew: boolean;
    readonly isDeleted: boolean;
    readonly isDirty: boolean;
    markDirty(): Promise<boolean>;
    getPath(propName?: string): string;
    readonly propertyName: string;
    getRoot(): ObservableObject;
    readonly hasOwner: boolean;
    changeState(propName: string, value: any, oldValue: any, eventInfo: EventInfo): void;
    protected init(): void;
    protected _childRelationsChanged(path: string): void;
    protected _setModel(value: any): void;
    protected createErrors(): void;
    protected createStates(): void;
    restored(): void;
    status: ObjectStatus;
    getSchema(propName?: string): any;
    private _createRelations;
    private _createViewRelations;
    private _createProperties;
    isArrayComposition(propName: string): boolean;
    modelErrors(propName: string): {
        message: string;
        severity: MessageServerity;
    }[];
    modelState(propName: string): any;
    model(propName?: string): any;
    setInstanceOptions(options: {
        external: boolean;
    }): void;
    private beforePropertyChanged;
    private _remove;
    remove(): Promise<void>;
    notifyOperation(propName: string, op: EventType, param: any): Promise<void>;
    viewOfMe<T extends ObservableObject>(classOfView: any): T;
    notifyHooks(propName: string, op: EventType, instance: ObservableObject): Promise<void>;
    private _viewFactory;
    execHooks(propName: string, op: EventType, source: ObservableObject): Promise<void>;
    private _addException;
    private _emitInstanceEvent;
    changeProperty(propName: string, oldValue: any, newValue: any, hnd: any, options: ChangePropertyOptions): Promise<void>;
    getOrSetProperty(propName: string, value?: any): Promise<any>;
    getPropertyByName(propName: string): any;
    setPropertyByName(propName: string, value: any): Promise<any>;
    afterCreated(): Promise<void>;
    afterRestore(): void;
    enumChildren(cb: (value: ObservableObject) => void, recursive: boolean): void;
    validate(options?: {
        full: boolean;
    }): Promise<void>;
    private _errorByName;
    constructor(transaction: TransactionContainer, parent: ObservableObject, propertyName: string, value: any, options: {
        isRestore: boolean;
    });
    destroy(): void;
    readonly $states: InstanceState;
    readonly $errors: InstanceErrors;
}
//# sourceMappingURL=model-object.d.ts.map