import {
	Instance, InstanceState, InstanceErrors, ModelManager,
	ErrorState, State, StringState, IntegerState, EnumState, NumberState, DateState, DateTimeState, RefArrayState, RefObjectState,
	IntegerValue, NumberValue
} from '../../../src/index';

const
	DEPARTMENT_SCHEMA = {
	"type": "object",
	"nameSpace": "employee",
	"name": "department",
	"primaryKey": [
		"code"
	],
	"properties": {
		"code": {
			"type": "string",
			"title": "Code"
		},
		"title": {
			"type": "string",
			"title": "Title"
		},
		"id": {
			"type": "integer",
			"generated": true
		}
	}
};

export class DepartmentState extends InstanceState {
	public get code(): StringState {
		return this._states.code;
	}
	public get title(): StringState {
		return this._states.title;
	}
	public get id(): IntegerState {
		return this._states.id;
	}
}

export class DepartmentErrors extends InstanceErrors {
	public get $(): ErrorState {
		return this._messages.$;
	}
	public get code(): ErrorState {
		return this._messages.code;
	}
	public get title(): ErrorState {
		return this._messages.title;
	}
	public get id(): ErrorState {
		return this._messages.id;
	}
}

export class Department extends Instance {
	protected init() {
		super.init();
		let that = this;
		that._schema = DEPARTMENT_SCHEMA;
	}
	protected createStates() {
		let that = this;
		that._states = new DepartmentState(that, that._schema);
	}
	protected createErrors() {
		let that = this;
		that._errors = new DepartmentErrors(that, that._schema);
	}
	public code(value?: string): Promise<string> {
		return this.getOrSetProperty('code', value);
	}
	public title(value?: string): Promise<string> {
		return this.getOrSetProperty('title', value);
	}
	public get id(): IntegerValue {
		return this._children.id;
	}
	public get $states(): DepartmentState {
		return <DepartmentState>this._states;
	}
	public get $errors(): DepartmentErrors {
		return <DepartmentErrors>this._errors;
	}
}
new ModelManager().registerClass(Department, DEPARTMENT_SCHEMA.nameSpace);