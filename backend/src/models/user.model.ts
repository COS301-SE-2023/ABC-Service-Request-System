import { Schema, connection, model } from "mongoose"
import bcrypt from 'bcryptjs';


export interface user{
    name: string
    surname: string
    profilePhoto: string
    emailAddress: string
    emailVerified: boolean
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
        emailVerified: {type: Boolean, required: true, default: false},
        password: {type: String, required: true, select: false},
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


const userDb = connection.useDb("UserDB");
export const UserModel = userDb.model("user", userSchema);