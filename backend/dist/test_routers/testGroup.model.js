"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testGroupModel = exports.groupSchema = void 0;
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
  }]
});
exports.groupSchema = groupSchema;
var groupDB = _mongoose.connection.useDb("test");
var testGroupModel = groupDB.model("group", groupSchema);
exports.testGroupModel = testGroupModel;