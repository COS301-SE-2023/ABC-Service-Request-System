"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notificationsSchema = exports.TestNotificationsModel = void 0;
var _mongoose = require("mongoose");
var notificationsSchema = new _mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  profilePhotoLink: {
    type: String,
    required: true
  },
  notificationMessage: {
    type: String,
    required: true
  },
  creatorEmail: {
    type: String,
    required: true
  },
  assignedEmail: {
    type: String,
    required: true
  },
  ticketSummary: {
    type: String,
    required: true
  },
  ticketStatus: {
    type: String,
    required: true
  },
  notificationTime: {
    type: Date,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  readStatus: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
  timestamps: true
});
exports.notificationsSchema = notificationsSchema;
var notificationsDB = _mongoose.connection.useDb("test");
var TestNotificationsModel = notificationsDB.model("notifications", notificationsSchema);
exports.TestNotificationsModel = TestNotificationsModel;