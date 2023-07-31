"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userSchema = exports.UserModel = exports.ROLES_LIST = void 0;
var _mongoose = require("mongoose");
//import bcrypt from 'bcryptjs';

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

// userSchema.pre('save', async function (next) {
//     let user = this;

//     console.log('Is password modified?', user.isModified('password'));

//     if (!user.isModified('password')) {
//       return next();
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(user.password, salt);

//     console.log('Original password:', user.password);
//     console.log('Hasheded password:', hash);

//     user.password = hash;
//     next();
// });
exports.userSchema = userSchema;
var ROLES_LIST = {
  "Admin": "1001",
  "Manager": "1002",
  "Technical": "1003",
  "Functional": "1004",
  "Client": "1005"
};
exports.ROLES_LIST = ROLES_LIST;
var userDb = _mongoose.connection.useDb("UserDB");
var UserModel = userDb.model("user", userSchema);

// export const UserModel2 = model<user>('User', userSchema);
exports.UserModel = UserModel;