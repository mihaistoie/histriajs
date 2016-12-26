


export enum ObjectStatus {
    idle = 0,
    restoring = 1,
    creating = 2
}

export enum EventType {
    propChanged = 0,
    propValidate = 1,
    init = 2,
    objValidate = 3
}




export enum MessageServerity {
    error = 0,
    warning = 1,
    success = 2
}

export interface EventInfo {
    push(info: any): void
    pop(): void;
    destroy(): void;
    isTriggeredBy(peopertyName: string, target: any): boolean;
}

export interface UserContext {
    lang: string;
    country: string;
    locale: any;
    formatNumber(value: number, decimals: number): string
}

export interface TransactionContainer {
    context: UserContext
    emitInstanceEvent(eventType: EventType, eventInfo: EventInfo, classOfInstance: any, instance: any, ...args);
}


export interface ObservableObject {
    propertyChanged(propName: string, value: any, oldValue: any, eventInfo: EventInfo): void;
    stateChanged(stateName: string, value: any, oldValue: any, eventInfo?: EventInfo): void;
    changeProperty(propName: string, oldValue: any, newValue: any, hnd: any): Promise<void>
    model(propName?: string): any;
    modelState(propName: string): any;
    modelErrors(propName: string): { message: string, severity: MessageServerity }[];
    getPath(propName?: string): string;
    getRoot(): ObservableObject;
    context: UserContext;
    destroy();
}

export interface ObservableArray {
    propertyChanged(propName: string, value: any, oldValue: any, eventInfo: EventInfo): void;
    stateChanged(stateName: string, value: any, oldValue: any, eventInfo?: EventInfo): void;
    getPath(item?: ObservableObject): string;
    getRoot(): ObservableObject;
    destroy();
}

