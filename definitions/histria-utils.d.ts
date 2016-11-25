// Generated by dts-bundle v0.6.1

declare module 'histria-utils' {
    export { Instance, InstanceState, InstanceErrors } from 'histria-utils/lib/model/base-object';
    export { ModelManager } from 'histria-utils/lib/model/model-manager';
    export { Transaction } from 'histria-utils/lib/factory/transaction';
    export { propChanged, init, title, loadRules } from 'histria-utils/lib/model/rules';
    export { ErrorState } from 'histria-utils/lib/model/error';
    export { State, StringState, IntegerState, EnumState, NumberState, DateState, DateTimeState, RefArrayState, RefObjectState } from 'histria-utils/lib/model/state';
    export { IntegerValue, NumberValue } from 'histria-utils/lib/model/number';
}

declare module 'histria-utils/lib/model/base-object' {
    import { ObservableObject, ObservableArray, EventInfo, ObjectStatus, MessageServerity, UserContext, TransactionContainer } from 'histria-utils/lib/model/interfaces';
    export class InstanceState {
        protected _states: any;
        constructor(parent: ObservableObject, schema: any);
        destroy(): void;
    }
    export class InstanceErrors {
        protected _messages: any;
        constructor(parent: ObservableObject, schema: any);
        destroy(): void;
    }
    export class Instance implements ObservableObject {
        protected _status: ObjectStatus;
        protected _transaction: any;
        protected _parent: ObservableObject;
        protected _parentArray: ObservableArray;
        protected _children: any;
        protected _schema: any;
        protected _rootCache: ObservableObject;
        protected _model: any;
        protected _states: InstanceState;
        protected _errors: InstanceErrors;
        protected _propertyName: string;
        protected _getEventInfo(): EventInfo;
        readonly context: UserContext;
        getPath(propName?: string): string;
        getRoot(): ObservableObject;
        propertyChanged(propName: string, value: any, oldValue: any, eventInfo: EventInfo): void;
        stateChanged(propName: string, value: any, oldValue: any, eventInfo: EventInfo): void;
        protected init(): void;
        protected _setModel(value: any): void;
        protected createErrors(): void;
        protected createStates(): void;
        modelErrors(propName: string): {
            message: string;
            severity: MessageServerity;
        }[];
        modelState(propName: string): any;
        getOrSetProperty(propName: string, value?: any): Promise<any>;
        constructor(transaction: TransactionContainer, parent: ObservableObject, parentArray: ObservableArray, propertyName: string, value: any, options: {
            isCreate: boolean;
            isRestore: boolean;
        });
        destroy(): void;
        readonly $states: InstanceState;
        readonly $errors: InstanceErrors;
    }
}

declare module 'histria-utils/lib/model/model-manager' {
    export class ModelManager {
        constructor();
        createInstance<T>(classOfInstance: any, transaction: any, value: any, options: {
            isCreate: boolean;
            isRestore: boolean;
        }): T;
        registerClass(constructor: any, nameSpace: string): void;
        rulesForPropChange(classOfInstance: any, propertyName: string): any[];
        setTitle(classOfInstance: any, method: any, title: string, description?: string): void;
        addRule(classOfInstance: any, ruleType: string, rule: any, ruleParams?: any): void;
    }
}

declare module 'histria-utils/lib/factory/transaction' {
    import { UserContext, TransactionContainer } from 'histria-utils/lib/model/interfaces';
    export class Transaction implements TransactionContainer {
        constructor(ctx?: UserContext);
        readonly context: UserContext;
        create<T>(classOfInstance: any): T;
        restore<T>(classOfInstance: any, data: any): T;
        load<T>(classOfInstance: any, data: any): T;
        destroy(): void;
    }
}

declare module 'histria-utils/lib/model/rules' {
    export function title(targetClass: any, title: string, description?: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
    export function propChanged(targetClass: any, ...properties: string[]): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
    export function init(targetClass: any): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
    export function loadRules(folder: string): Promise<void>;
}

declare module 'histria-utils/lib/model/error' {
    import { ObservableObject } from 'histria-utils/lib/model/interfaces';
    export class ErrorState {
        constructor(parent: ObservableObject, propertyName: string);
        error: string;
        hasErrors(): boolean;
        addException(e: Error): void;
        destroy(): void;
    }
}

declare module 'histria-utils/lib/model/state' {
    import { ObservableObject } from 'histria-utils/lib/model/interfaces';
    export class State {
        protected _parent: ObservableObject;
        protected _propertyName: string;
        protected _stateModel: any;
        protected init(): void;
        constructor(parent: ObservableObject, propertyName: string);
        destroy(): void;
        isDisabled: boolean;
        isHidden: boolean;
        isMandatory: boolean;
        isReadOnly: boolean;
    }
    export class StringState extends State {
        protected init(): void;
        maxLength: number;
        minLength: number;
    }
    export class NumberBaseState extends State {
        protected init(): void;
        exclusiveMaximum: boolean;
        exclusiveMinimum: boolean;
        minimum: number;
        maximum: number;
    }
    export class NumberState extends NumberBaseState {
        protected init(): void;
        decimals: number;
    }
    export class IntegerState extends NumberBaseState {
        protected init(): void;
    }
    export class DateState extends State {
    }
    export class DateTimeState extends State {
    }
    export class EnumState extends State {
    }
    export class ArrayState extends State {
    }
    export class RefObjectState extends State {
    }
    export class RefArrayState extends State {
    }
}

declare module 'histria-utils/lib/model/number' {
    import { Instance } from 'histria-utils/lib/model/base-object';
    export class BaseNumberValue {
        protected _parent: Instance;
        protected _decimals: number;
        protected _propertyName: string;
        constructor(parent: Instance, propertyName: string);
        protected _internalDecimals(): number;
        protected init(): void;
        destroy(): void;
        value(value?: number): Promise<number>;
        decimals(value: number): Promise<number>;
    }
    export class IntegerValue extends BaseNumberValue {
    }
    export class NumberValue extends BaseNumberValue {
        decimals(value: number): Promise<number>;
        protected _internalDecimals(): number;
    }
}

declare module 'histria-utils/lib/model/interfaces' {
    export enum ObjectStatus {
        idle = 0,
        restoring = 1,
        loading = 2,
    }
    export enum MessageServerity {
        error = 0,
        warning = 1,
        success = 2,
    }
    export interface EventInfo {
        push(info: any): void;
        pop(): void;
        isTriggeredBy(peopertyName: string, target: any): boolean;
    }
    export interface UserContext {
        lang: string;
        country: string;
        locale: any;
        formatNumber(value: number, decimals: number): string;
    }
    export interface TransactionContainer {
        context: UserContext;
    }
    export interface ObservableObject {
        propertyChanged(propName: string, value: any, oldValue: any, eventInfo: EventInfo): void;
        stateChanged(stateName: string, value: any, oldValue: any, eventInfo?: EventInfo): void;
        modelState(propName: string): any;
        modelErrors(propName: string): {
            message: string;
            severity: MessageServerity;
        }[];
        getPath(propName?: string): string;
        getRoot(): ObservableObject;
        context: UserContext;
    }
    export interface ObservableArray {
        propertyChanged(propName: string, value: any, oldValue: any, eventInfo: EventInfo): void;
        stateChanged(stateName: string, value: any, oldValue: any, eventInfo?: EventInfo): void;
        getPath(item?: ObservableObject): string;
        getRoot(): ObservableObject;
    }
    export interface ObservableArray {
        parent: ObservableObject;
        propertyName: string;
    }
}

