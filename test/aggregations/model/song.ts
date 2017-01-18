import {
	Instance, InstanceState, InstanceErrors, ModelManager,
	HasManyComposition, HasManyAggregation,
	ErrorState, State, StringState, IdState, IntegerState, EnumState, NumberState, DateState, DateTimeState, RefArrayState, RefObjectState,
	IntegerValue, NumberValue
} from '../../../src/index';
import { Cd } from './cd';


export class Song extends Instance {
	protected init() {
		super.init();
		let that = this;
		that._schema = SONG_SCHEMA;
	}
	protected createStates() {
		let that = this;
		that._states = new SongState(that, that._schema);
	}
	protected createErrors() {
		let that = this;
		that._errors = new SongErrors(that, that._schema);
	}
	public get duration(): IntegerValue {
		return this._children.duration;
	}
	public get cdChangedHits(): IntegerValue {
		return this._children.cdChangedHits;
	}
	public get id(): any {
		return this._children.id.value;
	}
	public get cdId(): any {
		return this._children.cdId.value;
	}
	public cd(): Promise<Cd> {
		return this._children.cd.getValue();
	}
	public setCd(value: Cd): Promise<Cd> {
		return this._children.cd.setValue(value);
	}
	public get $states(): SongState {
		return <SongState>this._states;
	}
	public get $errors(): SongErrors {
		return <SongErrors>this._errors;
	}
}

export class SongErrors extends InstanceErrors {
	public get $(): ErrorState {
		return this._messages.$;
	}
	public get duration(): ErrorState {
		return this._messages.duration;
	}
	public get cdChangedHits(): ErrorState {
		return this._messages.cdChangedHits;
	}
	public get id(): ErrorState {
		return this._messages.id;
	}
	public get cdId(): ErrorState {
		return this._messages.cdId;
	}
	public get cd(): ErrorState {
		return this._messages.cd;
	}
}

export class SongState extends InstanceState {
	public get duration(): IntegerState {
		return this._states.duration;
	}
	public get cdChangedHits(): IntegerState {
		return this._states.cdChangedHits;
	}
	public get id(): IdState {
		return this._states.id;
	}
	public get cdId(): IdState {
		return this._states.cdId;
	}
}
const
	SONG_SCHEMA = {
		"type": "object",
		"name": "song",
		"nameSpace": "aggregations",
		"properties": {
			"duration": {
				"type": "integer",
				"default": 0
			},
			"cdChangedHits": {
				"type": "integer",
				"default": 0
			},
			"id": {
				"type": "integer",
				"generated": true,
				"format": "id"
			},
			"cdId": {
				"type": "integer",
				"isReadOnly": true,
				"format": "id"
			}
		},
		"relations": {
			"cd": {
				"type": "belongsTo",
				"model": "cd",
				"aggregationKind": "shared",
				"invRel": "songs",
				"nameSpace": "aggregations",
				"title": "cd",
				"invType": "hasMany",
				"localFields": [
					"cdId"
				],
				"foreignFields": [
					"id"
				]
			}
		}
	};
new ModelManager().registerClass(Song, SONG_SCHEMA.name, SONG_SCHEMA.nameSpace);