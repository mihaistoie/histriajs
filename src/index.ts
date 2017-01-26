export { Instance } from './lib/model/base-object';
export { InstanceErrors } from './lib/model/instance-errors';
export { InstanceState } from './lib/model/instance-state';
export { ModelManager } from './lib/model/model-manager';
export { Transaction } from './lib/factory/transaction';
export { HasManyComposition, HasManyAggregation } from './lib/model/relations/roleHasMany';
export { propChanged, addItem, rmvItem, setItems, init, title, loadRules, validate } from './lib/model/rules';
export { ErrorState } from './lib/model/error-state';
export { State, StringState, IdState, IntegerState, BooleanState, EnumState, NumberState, DateState, DateTimeState, RefArrayState, RefObjectState } from './lib/model/state';
export { IntegerValue, NumberValue } from './lib/model/number';
export { classGenerator } from './lib/generators/classgen';

