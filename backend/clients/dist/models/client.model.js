"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestSchema = exports.projectSchema = exports.ClientModel = void 0;
var _mongoose = require("mongoose");
var _group = require("./group.model");
var projectSchema = new _mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  // tickets: { type: [ticketSchema], required: false},
  assignedGroups: {
    type: [_group.groupSchema],
    required: false
  },
  lowPriorityTime: {
    type: String,
    required: false
  },
  mediumPriorityTime: {
    type: String,
    required: false
  },
  highPriorityTime: {
    type: String,
    required: false
  }
});
exports.projectSchema = projectSchema;
var requestSchema = new _mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  additionalInformation: {
    type: String,
    required: false
  },
  projectName: {
    type: String,
    required: false
  },
  projectId: {
    type: String,
    required: false
  },
  clientId: {
    type: String,
    required: false
  },
  projectSelected: {
    type: String,
    required: false
  },
  summary: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  priority: {
    type: String,
    required: false
  },
  endDate: {
    type: String,
    required: false
  }
});
exports.requestSchema = requestSchema;
var clientSchema = new _mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  organisation: {
    type: String,
    required: true
  },
  profilePhoto: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  emailVerified: {
    type: Boolean,
    required: true,
    "default": false
  },
  password: {
    type: String,
    required: true,
    select: true
  },
  industry: {
    type: String,
    required: true
  },
  inviteToken: {
    type: String
  },
  // Add inviteToken field
  projects: {
    type: [projectSchema],
    required: true
  },
  requests: {
    type: [requestSchema],
    required: false
  },
  chatId: {
    type: String,
    required: false
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
var clientDb = _mongoose.connection.useDb("ClientDB");
var ClientModel = clientDb.model("client", clientSchema);
exports.ClientModel = ClientModel;