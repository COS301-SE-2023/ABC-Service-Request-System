import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { UserModel } from "../models/user.model";
import { sample_users } from "../sampleUsers";  // Replace this with your actual sample user data

const router = Router();

router.get('/seed', expressAsyncHandler(
    async (req, res) => {
        const usersCount = await UserModel.countDocuments();
        if(usersCount > 0){
            res.send("Seed is already done");
            return;
        }

        await UserModel.create(sample_users);
        res.json("Seed is done!");
    }
));

router.get('/', expressAsyncHandler(
    async (req, res) => {
        const users = await UserModel.find();
        res.send(users);
    }
));

router.get('/delete', expressAsyncHandler(
    async (req, res) => {
        await UserModel.deleteMany({});
        res.send("Delete is done!");
    }
));

export default router;

// import { Router, Request, Response, NextFunction } from "express";
// import expressAsyncHandler from "express-async-handler";
// import { UserModel } from "../models/user.model";
// import bcrypt from 'bcryptjs';
// import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";

// const router = Router();

// router.get('/seed', expressAsyncHandler<void>(
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const usersCount = await UserModel.countDocuments();
//       if (usersCount > 0) {
//         res.send("Seed is already done");
//       } else {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash('defaultPassword', salt);

//         const adminUser = new UserModel({
//           name: "Admin",
//           surname: "Admin",
//           profilePhoto: "admin.jpg",
//           emailAddress: "admin@example.com",
//           password: hashedPassword,
//           roles: ["Admin"],
//           groups: ["Admin"]
//         });

//         await adminUser.save();
//         res.json("Seed is done!");
//       }
//     } catch (error) {
//       next(error);
//     }
//   }
// ));

// router.post('/reset-password', expressAsyncHandler<void>(
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const user = await UserModel.findOne({ emailAddress: req.body.emailAddress });

//       if (!user) {
//         return res.status(404).send("No user found.");
//       }

//       // Create a password reset token
//       const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

//       // Send email
//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: process.env.EMAIL_ADDRESS,
//           pass: process.env.EMAIL_PASSWORD
//         }
//       });

//       const mailOptions = {
//         from: process.env.EMAIL_ADDRESS,
//         to: user.emailAddress,
//         subject: 'Password Reset',
//         text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
//           Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:
//           http://<your_domain>/reset-password/${token}
//           If you did not request this, please ignore this email and your password will remain unchanged.`
//       };

//       transporter.sendMail(mailOptions, (error: any, response: any) => {
//         if (error) {
//           console.error('there was an error: ', error);
//           res.status(500).send('Failed to send recovery email');
//         } else {
//           res.status(200).send('Recovery email sent');
//         }
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// ));

// router.post('/reset-password/:token', expressAsyncHandler<void>(
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const { token } = req.params;

//       if (!token) {
//         return res.status(401).send("Invalid token.");
//       }

//       let payload: any;
//       try {
//         payload = jwt.verify(token, process.env.JWT_SECRET!);
//       } catch (e) {
//         return res.status(401).send("Invalid token.");
//       }

//       const user = await UserModel.findById(payload._id).select("+password");

//       if (!user) {
//         return res.status(404).send("No user found.");
//       }

//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(req.body.password, salt);
//       user.password = hashedPassword;
//       await user.save();

//       res.status(200).send("Password updated successfully.");
//     } catch (error) {
//       next(error);
//     }
//   }
// ));

// export default router;
