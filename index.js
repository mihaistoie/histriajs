"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base_object_1 = require("./lib/model/base-object");
exports.Instance = base_object_1.Instance;
var instance_errors_1 = require("./lib/model/states/instance-errors");
exports.InstanceErrors = instance_errors_1.InstanceErrors;
var instance_state_1 = require("./lib/model/states/instance-state");
exports.InstanceState = instance_state_1.InstanceState;
var error_state_1 = require("./lib/model/states/error-state");
exports.ErrorState = error_state_1.ErrorState;
var model_manager_1 = require("./lib/model/model-manager");
exports.modelManager = model_manager_1.modelManager;
var transaction_1 = require("./lib/factory/transaction");
exports.Transaction = transaction_1.Transaction;
var role_has_many_1 = require("./lib/model/relations/role-has-many");
exports.HasManyComposition = role_has_many_1.HasManyComposition;
exports.HasManyAggregation = role_has_many_1.HasManyAggregation;
var decorators_1 = require("./lib/model/rules/decorators");
exports.propChanged = decorators_1.propChanged;
exports.addItem = decorators_1.addItem;
exports.rmvItem = decorators_1.rmvItem;
exports.setItems = decorators_1.setItems;
exports.init = decorators_1.init;
exports.title = decorators_1.title;
exports.loadRules = decorators_1.loadRules;
exports.validate = decorators_1.validate;
var state_1 = require("./lib/model/states/state");
exports.State = state_1.State;
exports.StringState = state_1.StringState;
exports.IdState = state_1.IdState;
exports.IntegerState = state_1.IntegerState;
exports.BooleanState = state_1.BooleanState;
exports.EnumState = state_1.EnumState;
exports.NumberState = state_1.NumberState;
exports.DateState = state_1.DateState;
exports.DateTimeState = state_1.DateTimeState;
exports.RefArrayState = state_1.RefArrayState;
exports.RefObjectState = state_1.RefObjectState;
var number_1 = require("./lib/model/types/number");
exports.IntegerValue = number_1.IntegerValue;
exports.NumberValue = number_1.NumberValue;
var id_1 = require("./lib/model/types/id");
exports.IdValue = id_1.IdValue;
var classgen_1 = require("./lib/generators/classgen");
exports.classGenerator = classgen_1.classGenerator;
