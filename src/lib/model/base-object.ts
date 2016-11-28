import { ObservableObject, ObservableArray, EventInfo, ObjectStatus, MessageServerity, UserContext, TransactionContainer, EventType } from './interfaces';
import { ApplicationError } from '../utils/errors';
import { ModelManager } from './model-manager';
import * as schemaUtils from '../schema/schema-utils';
import { JSONTYPES } from '../schema/schema-consts';

import { IntegerValue, NumberValue } from './number';
import { InstanceErrors } from './instance-errors'
import { InstanceState } from './instance-state'
import { EventInfoStack } from './event-stack'

import * as helper from '../utils/helper';
import * as util from 'util';





export class Instance implements ObservableObject {
	//used only in root
	protected _status: ObjectStatus;
	protected _transaction: TransactionContainer;
	//when set _parent reset _rootCache
	protected _parent: ObservableObject;
	protected _parentArray: ObservableArray;
	protected _children: any;
	protected _schema: any;
	protected _rootCache: ObservableObject;
	private _eventInfo: EventInfo;
	private _afterCreateCalled: boolean;
	protected _model: any;
	protected _states: InstanceState;
	protected _errors: InstanceErrors;
	protected _propertyName: string;
	private _context: UserContext;
	protected _getEventInfo(): EventInfo {
		let that = this;
		let root = <Instance>that.getRoot();
		if (root === this) {
			if (!that._eventInfo)
				that._eventInfo = new EventInfoStack();
			return that._eventInfo;
		} else
			return root._getEventInfo();
	}

	public get context(): UserContext {
		return this._context;
	}

	public get isNew(): boolean {
		return this._model.isNew === true;
	}

	public getPath(propName?: string): string {
		let that = this;
		let root = that._parentArray ? that._parentArray.getPath(that) : (that._parent ? that._parent.getPath(that._propertyName) : '');
		return propName ? (root ? (root + '.' + propName) : propName) : root;
	}

	public getRoot(): ObservableObject {
		let that = this;
		if (!that._rootCache)
			that._rootCache = that._parent ? that._parent.getRoot() : that;
		return that._rootCache;
	}


	public propertyChanged(propName: string, value: any, oldValue: any, eventInfo: EventInfo) {
	}
	public stateChanged(propName: string, value: any, oldValue: any, eventInfo: EventInfo) {
	}
	protected init() {
	}

	//called only on create or on load 
	protected _setModel(value: any) {
		let that = this;
		if (!value) throw "Invalid model (null)."
		that._model = value;
		if (that._children)
			helper.destroy(that._children);
		that._children = {};
		that.createStates();
		that.createErrors();
		that._createProperties();

	}
	protected createErrors() { }
	protected createStates() { }

	public get status(): ObjectStatus {
		let that = this;
		let root = <Instance>that.getRoot();
		return root._status;
	}
	public set status(value: ObjectStatus) {
		let that = this;
		let root = <Instance>that.getRoot();
		root._status = value;
	}


	public getSchema(propName?: string): any {
		let that = this;
		if (!propName || propName === '$') return that._schema;
		return that._schema.properties[propName];
	}


	private _createProperties() {
		let that = this;
		that._schema && that._schema.properties && Object.keys(that._schema.properties).forEach(propName => {
			let cs = that._schema.properties[propName];
			let propType = schemaUtils.typeOfProperty(cs);
			switch (propType) {
				case JSONTYPES.integer:
					that._children[propName] = new IntegerValue(that, propName);
					break;
				case JSONTYPES.number:
					that._children[propName] = new NumberValue(that, propName);
					break;
			}
		});
	}

	public modelErrors(propName: string): { message: string, severity: MessageServerity }[] {
		let that = this;
		that._model.$errors = that._model.$errors || {};
		if (propName === '$' && !that._parentArray && that._parent && that._propertyName) {
			return that._parent.modelErrors(that._propertyName)
		}
		that._model.$errors[propName] = that._model.$errors[propName] || [];
		return that._model.$errors[propName];
	}

	public modelState(propName: string): any {
		let that = this;
		that._model.$states = that._model.$states || {};
		let ss = that._model.$states[propName];
		if (!ss) {
			//if $states[propName] not exists init using schema 
			if (that._schema.states && that._schema.states[propName])
				ss = helper.clone(that._schema.states[propName]);
			else
				ss = {};
			that._model.$states[propName] = ss;
		}
		return ss;
	}


	public async getOrSetProperty(propName: string, value?: any): Promise<any> {
		let that = this;
		let isSet = (value !== undefined), isComplex = false, propPath;
		let eventInfo = that._getEventInfo();
		if (isSet)
			eventInfo.push({ path: that.getPath(propName), eventType: EventType.propChanged });
		try {
			let propSchema = that._schema.properties[propName];
			let mm = new ModelManager();
			if (!propSchema)
				throw new ApplicationError(util.format('Property not found: "%s".', propName));
			if (schemaUtils.isComplex(propSchema)) {
				isComplex = true;
				if (isSet) {
					if (schemaUtils.isArray(propSchema))
						throw new ApplicationError(util.format('Can\'t set "%s", because is an array.', propName));
					try {
						// clear errors for propName
						// I don't now what to do 
						that._errors[propName].error = '';
						that._children[propName] = value;

					} catch (ex) {
						that._errors[propName].addException(ex);
					}
				}
			} else {
				if (isSet) {
					// set
					if (that._model[propName] !== value) {
						let oldValue = that._model[propName];
						that._model[propName] = value;
						try {
							// clear errors for propName
							that._errors[propName].error = '';
							// Validate rules 
							if (that.status === ObjectStatus.idle)
								await that._transaction.emitInstanceEvent(EventType.propValidate, eventInfo, that.constructor, that, propName, that._model[propName]);
							// Proppagation rules
							if (that.status === ObjectStatus.idle)
								await that._transaction.emitInstanceEvent(EventType.propChanged, eventInfo, that.constructor, that, propName, that._model[propName], oldValue);
						} catch (ex) {
							that._errors[propName].addException(ex);
						}
					}
				}
			}
		} finally {
			if (isSet)
				eventInfo.pop()
		}
		return isComplex ? that._children[propName] : that._model[propName];
	}

	public async afterCreated() {
		let that = this;
		if (that._afterCreateCalled) return;
		that._afterCreateCalled = true;
		let eventInfo = that._getEventInfo();
		try {
			if (that.status === ObjectStatus.creating) {
				await that._transaction.emitInstanceEvent(EventType.init, eventInfo, that.constructor, that);
			}
		} finally {
			that.status = ObjectStatus.idle;
		}
	}


	constructor(transaction: TransactionContainer, parent: ObservableObject, parentArray: ObservableArray, propertyName: string, value: any, options: { isRestore: boolean }) {
		let that = this;
		that._context = transaction.context;
		that._parent = parent;
		that._parentArray = parentArray;
		that.status = options.isRestore ? ObjectStatus.restoring : ObjectStatus.creating;
		that._propertyName = propertyName;
		that._transaction = transaction;
		that.init();
		that._setModel(value);
	}

	public destroy() {
		let that = this;
		that._schema = null;
		that._model = null;
		that._rootCache = null;
		if (that._states) {
			that._states.destroy();
			that._states = null;
		}
		if (that._children) {
			helper.destroy(that._children);
			that._children = null;

		}
		if (that._eventInfo) {
			that._eventInfo.destroy();
			that._eventInfo = null;

		}
		if (that._errors) {
			that._errors.destroy();
			that._errors = null;

		}
		that._context = null;
		that._parent = null;
		that._parentArray = null;
		that._propertyName = null;

	}
	public get $states(): InstanceState {
		return <InstanceState>this._states;
	}
	public get $errors(): InstanceErrors {
		return <InstanceErrors>this._errors;
	}

}

