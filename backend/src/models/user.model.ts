import { Schema, connection, model } from "mongoose"

import { dbConnection } from '../configs/userDB.config';
    
const db = dbConnection();

export interface user{
    name: string
    surname: string
    profilePhoto: string
    emailAddress: string
    password: string
    roles: string []
    groups: string []

}

export const userSchema = new Schema<any>(
    {
        name: {type: String, required: true},
        surname:{type: String, required: true},
        profilePhoto:{type: String, required: true},
        emailAddress: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        roles: {type: [String], required: true},
        groups: {type: [String], required: true},

        
    },{
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    }
);

const userDb = connection.useDb("UserDB");
export const UserModel = userDb.model("user", userSchema);