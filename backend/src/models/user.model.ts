import { Schema, model } from "mongoose"

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

export const userModel = model<any>('user', userSchema);