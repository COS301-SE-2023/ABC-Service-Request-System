"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.userSchema = void 0;
var mongoose_1 = require("mongoose");
var roles = ["Manager", "Functional", "Technical", "Admin"];
exports.userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    profilePhoto: { type: String, required: true },
    emailAddress: { type: String, unique: true, required: true },
    emailVerified: { type: Boolean, required: true, default: false },
    password: { type: String, required: true, select: true },
    roles: { type: [String], required: true, enum: roles },
    groups: { type: [String], required: true },
    inviteToken: { type: String }, // Add inviteToken field
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
var userDb = mongoose_1.connection.useDb("UserDB");
exports.UserModel = userDb.model("user", exports.userSchema);
