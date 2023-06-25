import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { UserModel } from "../models/user.model";

import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";


const router = Router();

router.post("/", expressAsyncHandler(
    async (req, res) => {
      try {
        console.log("Login request received:", req.body); // Log the request body
  
        const user = await UserModel.findOne({ emailAddress: req.body.emailAddress }).select("+password");
  
        console.log("User found:", user); // Log the user object
  
        if (user) {
          console.log("Request password:", req.body.password);
          console.log("User password:", user.password);
  
          console.log("Hashededed password from DB:", user.password);  // Add this line
  
          console.log("Types:", typeof req.body.password, typeof user.password);  
          const validPassword = await bcrypt.compare(req.body.password, user.password);
          console.log("Result of bcrypt compare:", validPassword);
  
  
          if (!validPassword) {
            console.log("Invalid password");
            res.status(401).send({ auth: false, token: null });
            return;
          }
  
          const secretKey = process.env.JWT_SECRET;
  
          if (!secretKey) {
            console.log("JWT Secret is not defined");
            throw new Error('JWT Secret is not defined');
          }
          
          //loop through roles and add them to the token
          
          let setRoles : string = "Default";


          for (let role of user.roles){
            if(role == "Admin"){
              setRoles = role;
              break;
            }else if(role == "Manager"){
              setRoles = role;
              break;
            }else if(role == "Functional"){
              setRoles = role;
              break;
            }else if(role == "Technical"){
              setRoles = role;
            }
          }
          const token = jwt.sign({ _id: user._id, role: setRoles , name: user.name  }, secretKey, {
            expiresIn: 86400, // expires in 24 hours
          });
  
          console.log("Login successful");
          res.status(200).send({ auth: true, token });
        } else {
          console.log("User not found");
          res.status(404).send("No user found.");
        }
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("An error occurred during login.");
      }
    })
  );

export default router;