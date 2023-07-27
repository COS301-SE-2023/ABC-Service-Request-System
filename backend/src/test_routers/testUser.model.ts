import { Schema, connection } from "mongoose"


type Role = "Manager" | "Functional" | "Technical" | "Admin";
let roles: Role[] = ["Manager", "Functional", "Technical", "Admin"];


export interface user{
    name: string
    surname: string
    profilePhoto: string
    emailAddress: string
    emailVerified: boolean
    password: string
    roles: Role []
    groups: string []
    inviteToken?: string
}

export const userSchema = new Schema<user>(
    {
        name: {type: String, required: true},
        surname:{type: String, required: true},
        profilePhoto:{type: String, required: false},
        emailAddress: {type: String, unique: true, required: true},
        emailVerified: {type: Boolean, required: true, default: false},
        password: {type: String, required: true, select: true},
        roles: {type: [String], required: true, enum: roles},
        groups: {type: [String], required: true},
        inviteToken: { type: String }, // Add inviteToken field

        
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

const userDb = connection.useDb("test");
export const TestUserModel = userDb.model("user", userSchema);