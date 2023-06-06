import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import { UserModel } from "../models/user.model";

const router = Router();

router.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      console.log("Signup request received:", req.body); // Log the request body

      // check if a user with the provided email already exists
      const user = await UserModel.findOne({ emailAddress: req.body.emailAddress });

      if (user) {
        console.log("User with this email already exists");
        res.status(409).send("User with this email already exists.");
        return;
      }

      // generate password hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // create new user
      const newUser = new UserModel({
        name: req.body.name,
        surname: req.body.surname,
        profilePhoto: req.body.profilePhoto,
        emailAddress: req.body.emailAddress,
        password: hashedPassword,
        roles: req.body.roles,
        groups: req.body.groups
      });

      await newUser.save();

      console.log("Signup successful");
      res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).send("An error occurred during signup.");
    }
  })
);


export default router;
