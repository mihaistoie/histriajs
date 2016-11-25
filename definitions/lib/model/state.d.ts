import { ObservableObject } from './interfaces';
export declare class State {
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
export declare class StringState extends State {
    protected init(): void;
    maxLength: number;
    minLength: number;
}
export declare class NumberBaseState extends State {
    protected init(): void;
    exclusiveMaximum: boolean;
    exclusiveMinimum: boolean;
    minimum: number;
    maximum: number;
}
export declare class NumberState extends NumberBaseState {
    protected init(): void;
    decimals: number;
}
export declare class IntegerState extends NumberBaseState {
    protected init(): void;
}
export declare class DateState extends State {
}
export declare class DateTimeState extends State {
}
export declare class EnumState extends State {
}
export declare class ArrayState extends State {
}
export declare class RefObjectState extends State {
}
export declare class RefArrayState extends State {
}
