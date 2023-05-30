import { Schema, model } from "mongoose"

export interface login{
    emailAddress: string
    password: string
}

export const loginSchema = new Schema<any>(
    {
        emailAddress: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        
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

export const loginModel = model<any>('login', loginSchema);