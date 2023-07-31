"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userSchema = exports.TestUserModel = void 0;
var _mongoose = require("mongoose");
var roles = ["Manager", "Functional", "Technical", "Admin"];
var userSchema = new _mongoose.Schema({
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
  profilePhoto: {
    type: String,
    required: false
  },
  headerPhoto: {
    type: String,
    required: false
  },
  emailAddress: {
    type: String,
    unique: true,
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
  roles: {
    type: [String],
    required: true,
    "enum": roles
  },
  groups: {
    type: [String],
    required: false,
    "default": []
  },
  inviteToken: {
    type: String
  },
  // Add inviteToken field
  bio: {
    type: String,
    required: false
  },
  github: {
    type: String,
    required: false
  },
  linkedin: {
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
exports.userSchema = userSchema;
var userDb = _mongoose.connection.useDb("test");
var TestUserModel = userDb.model("user", userSchema);
exports.TestUserModel = TestUserModel;