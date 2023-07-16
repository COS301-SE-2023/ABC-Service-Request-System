import { Schema, connection, model } from "mongoose"
//import bcrypt from 'bcryptjs';
type Role = "Manager" | "Functional" | "Technical" | "Admin";
let roles: Role[] = ["Manager", "Functional", "Technical", "Admin"];

export interface user{
    id: string
    name: string
    surname: string
    profilePhoto: string
    emailAddress: string
    emailVerified: boolean
    password: string
    roles: Role []
    groups: string []
    inviteToken?: string
    bio: string
    backgroundPhoto: string
    facebook: string
    github: string
    linkedin: string
    instagram: string
    location: string
}

export const userSchema = new Schema<user>(
    {
        id: {type: String, required: true},
        name: {type: String, required: true},
        surname:{type: String, required: true},
        profilePhoto:{type: String, required: false},
        emailAddress: {type: String, unique: true, required: true},
        emailVerified: {type: Boolean, required: true, default: false},
        password: {type: String, required: true, select: true},
        roles: {type: [String], required: true, enum: roles},
        groups: {type: [String], required: true},
        inviteToken: { type: String }, // Add inviteToken field
        bio: {type: String, required:false},//I added now
        backgroundPhoto: {type: String, required:false},//I added now
        facebook: {type: String, required: false},
        github: {type: String, required: false},
        linkedin: {type: String, required: false},
        instagram: {type: String, required: false},
        location: {type: String, required: false}
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