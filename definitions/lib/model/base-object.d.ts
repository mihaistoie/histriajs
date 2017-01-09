import { ObservableObject, ObservableArray, EventInfo, ObjectStatus, MessageServerity, UserContext, TransactionContainer } from './interfaces';
import { InstanceErrors } from './instance-errors';
import { InstanceState } from './instance-state';
export declare class Instance implements ObservableObject {
    protected _status: ObjectStatus;
    protected _transaction: TransactionContainer;
    protected _parent: ObservableObject;
    protected _parentArray: ObservableArray;
    protected _children: any;
    protected _schema: any;
    protected _rootCache: ObservableObject;
    private _eventInfo;
    private _afterCreateCalled;
    protected _model: any;
    protected _states: InstanceState;
    protected _errors: InstanceErrors;
    protected _propertyName: string;
    private _context;
    protected removeChild(relationName: string, child: ObservableArray): Promise<void>;
    protected addChild(relationName: string, child: ObservableArray): Promise<void>;
    protected _getEventInfo(): EventInfo;
    readonly context: UserContext;
    readonly transaction: TransactionContainer;
    readonly parent: ObservableObject;
    readonly uuid: string;
    readonly isNew: boolean;
    getPath(propName?: string): string;
    readonly propertyName: string;
    getRoot(): ObservableObject;
    propertyChanged(propName: string, value: any, oldValue: any, eventInfo: EventInfo): void;
    stateChanged(propName: string, value: any, oldValue: any, eventInfo: EventInfo): void;
    protected init(): void;
    protected _setModel(value: any): void;
    protected createErrors(): void;
    protected createStates(): void;
    status: ObjectStatus;
    getSchema(propName?: string): any;
    private _createProperties();
    modelErrors(propName: string): {
        message: string;
        severity: MessageServerity;
    }[];
    modelState(propName: string): any;
    model(propName?: string): any;
    private beforePropertyChanged(propName, oldValue, newValue);
    changeProperty(propName: string, oldValue: any, newValue: any, hnd: any): Promise<void>;
    getOrSetProperty(propName: string, value?: any): Promise<any>;
    afterCreated(): Promise<void>;
    validate(options?: {
        full: boolean;
    }): Promise<void>;
    constructor(transaction: TransactionContainer, parent: ObservableObject, parentArray: ObservableArray, propertyName: string, value: any, options: {
        isRestore: boolean;
    });
    destroy(): void;
    readonly $states: InstanceState;
    readonly $errors: InstanceErrors;
}
