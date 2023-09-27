"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.groupSchema = exports.groupModel = void 0;
var _mongoose = require("mongoose");
var groupSchema = new _mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  groupName: {
    type: String,
    required: true
  },
  backgroundPhoto: {
    type: String,
    required: false
  },
  people: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  tickets: [{
    type: String,
    required: false
  }]
});
exports.groupSchema = groupSchema;
var groupDB = _mongoose.connection.useDb("GroupDB");
var groupModel = groupDB.model("group", groupSchema);
exports.groupModel = groupModel;