import {
	Instance, InstanceState, InstanceErrors, ModelManager,
	HasManyComposition, HasManyAggregation,
	ErrorState, State, StringState, IdState, IntegerState, EnumState, NumberState, DateState, DateTimeState, RefArrayState, RefObjectState,
	IntegerValue, NumberValue
} from '../../../src/index';
import { Order } from './order';


export class OrderItem extends Instance {
	protected init() {
		super.init();
		let that = this;
		that._schema = ORDERITEM_SCHEMA;
	}
	protected createStates() {
		let that = this;
		that._states = new OrderItemState(that, that._schema);
	}
	protected createErrors() {
		let that = this;
		that._errors = new OrderItemErrors(that, that._schema);
	}
	public get id(): Promise<any> {
		return this._children.id.value();
	}
	public get orderId(): Promise<any> {
		return this._children.orderId.value();
	}
	public order(value?: Order): Promise<Order> {
		return this._children.order.value(value);
	}
	public get $states(): OrderItemState {
		return <OrderItemState>this._states;
	}
	public get $errors(): OrderItemErrors {
		return <OrderItemErrors>this._errors;
	}
}

export class OrderItemErrors extends InstanceErrors {
	public get $(): ErrorState {
		return this._messages.$;
	}
	public get id(): ErrorState {
		return this._messages.id;
	}
	public get orderId(): ErrorState {
		return this._messages.orderId;
	}
	public get order(): ErrorState {
		return this._messages.order;
	}
}

export class OrderItemState extends InstanceState {
	public get id(): IdState {
		return this._states.id;
	}
	public get orderId(): IdState {
		return this._states.orderId;
	}
}
const
	ORDERITEM_SCHEMA = {
		"type": "object",
		"name": "orderItem",
		"nameSpace": "compositions",
		"properties": {
			"id": {
				"type": "integer",
				"generated": true,
				"format": "id"
			},
			"orderId": {
				"type": "integer",
				"isReadOnly": true,
				"format": "id"
			}
		},
		"relations": {
			"order": {
				"type": "belongsTo",
				"model": "order",
				"aggregationKind": "composite",
				"invRel": "items",
				"nameSpace": "compositions",
				"title": "order",
				"localFields": [
					"orderId"
				],
				"foreignFields": [
					"id"
				]
			}
		}
	};
new ModelManager().registerClass(OrderItem, ORDERITEM_SCHEMA.name, ORDERITEM_SCHEMA.nameSpace);