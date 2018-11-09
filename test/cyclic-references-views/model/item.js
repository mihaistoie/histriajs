"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../index");
class Item extends index_1.View {
    get id() {
        return this._children.id.value;
    }
    get groupId() {
        return this._children.groupId.value;
    }
    get groups() {
        return this._children.groups;
    }
    group() {
        return this._children.group.getValue();
    }
    setGroup(value) {
        return this._children.group.setValue(value);
    }
    get $states() {
        return this._states;
    }
    get $errors() {
        return this._errors;
    }
    init() {
        super.init();
        let that = this;
        that._schema = exports.ITEM_SCHEMA;
    }
    createStates() {
        let that = this;
        that._states = new ItemState(that, that._schema);
    }
    createErrors() {
        let that = this;
        that._errors = new ItemErrors(that, that._schema);
    }
}
Item.isPersistent = false;
exports.Item = Item;
class ItemErrors extends index_1.InstanceErrors {
    get $() {
        return this._messages.$;
    }
    get id() {
        return this._messages.id;
    }
    get groupId() {
        return this._messages.groupId;
    }
    get groups() {
        return this._messages.groups;
    }
}
exports.ItemErrors = ItemErrors;
class ItemState extends index_1.InstanceState {
    get id() {
        return this._states.id;
    }
    get groupId() {
        return this._states.groupId;
    }
}
exports.ItemState = ItemState;
/* tslint:disable:quotemark */
exports.ITEM_SCHEMA = {
    "type": "object",
    "view": true,
    "nameSpace": "cyclicreferencesviews",
    "properties": {
        "id": {
            "type": "integer",
            "generated": true,
            "format": "id"
        },
        "groupId": {
            "type": "integer",
            "isReadOnly": true,
            "format": "id"
        }
    },
    "relations": {
        "groups": {
            "type": "hasMany",
            "model": "group",
            "aggregationKind": "composite",
            "invRel": "item",
            "nameSpace": "cyclicreferencesviews",
            "title": "groups",
            "localFields": [
                "id"
            ],
            "foreignFields": [
                "itemId"
            ]
        },
        "group": {
            "type": "belongsTo",
            "model": "group",
            "aggregationKind": "composite",
            "invRel": "items",
            "nameSpace": "cyclicreferencesviews",
            "title": "group",
            "localFields": [
                "groupId"
            ],
            "foreignFields": [
                "id"
            ]
        }
    },
    "name": "item",
    "meta": {
        "parent": "group",
        "parentRelation": "group"
    }
};

//# sourceMappingURL=item.js.map
