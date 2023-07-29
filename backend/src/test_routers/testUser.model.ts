import { Schema, connection } from "mongoose"


type Role = "Manager" | "Functional" | "Technical" | "Admin";
let roles: Role[] = ["Manager", "Functional", "Technical", "Admin"];


export interface user{
    id: string
    name: string
    surname: string
    profilePhoto: string
    headerPhoto: string
    emailAddress: string
    emailVerified: boolean
    password: string
    roles: Role []
    groups: string []
    inviteToken?: string
    bio:string
    github:string
    linkedin:string
}

export const userSchema = new Schema<user>(
    {
        id: {type: String, required: true},
        name: {type: String, required: true},
        surname:{type: String, required: true},
        profilePhoto:{type: String, required: false},
        headerPhoto:{type: String, required: false},
        emailAddress: {type: String, unique: true, required: true},
        emailVerified: {type: Boolean, required: true, default: false},
        password: {type: String, required: true, select: true},
        roles: {type: [String], required: true, enum: roles},
        groups: {type: [String], required: false, default:[]},
        inviteToken: { type: String }, // Add inviteToken field
        bio: {type: String, required:false},
        github: {type: String, required:false},
        linkedin: {type:String, required: false},
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