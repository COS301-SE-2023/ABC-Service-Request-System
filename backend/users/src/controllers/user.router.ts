import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { UserModel } from "../models/user.model";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from 'bcryptjs';       
import multer, {Multer} from "multer";
import jwt from 'jsonwebtoken';
import { cloudinary } from '../configs/cloudinary';
import dotenv from "dotenv";
import { jwtVerify } from "../middleware/jwtVerify";
dotenv.config();

const router = Router();

router.get('/', jwtVerify(['Manager', 'Technical', 'Functional', 'Admin']), expressAsyncHandler(
    async (req, res) => {
        const users = await UserModel.find();
        res.send(users);
    }
));

router.post("/login", expressAsyncHandler(
    async (req, res) => {
        console.log("Login request received:", req.body); // Log the request body
      try {
        const user = await UserModel.findOne({ emailAddress: req.body.emailAddress }).select("+password");
  
        console.log("User found:", user); // Log the user object
  
        if (user) {
          const roles  = Object.values(user.roles);
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
          let setRoles: string[] = [];
          setRoles = user.roles;


          // let setRoles : string = "Default";


          // for (let role of user.roles){
          //   if(role == "Admin"){
          //     setRoles = role;
          //     break;
          //   }else if(role == "Manager"){
          //     setRoles = role;
          //     break;
          //   }else if(role == "Functional"){
          //     setRoles = role;
          //     break;
          //   }else if(role == "Technical"){
          //     setRoles = role;
          //   }
          // }
          const token = jwt.sign({ _id: user._id, role: setRoles , user: user, name: user.name , objectName: "UserInfo"}, secretKey, {
            expiresIn: 86400, // expires in 24 hours
          });

          console.log("Token:", token);
  
          // console.log("Login successful");
          res.status(200).send({ auth: true, token });
        } else {
          // console.log("User not found");
          res.status(404).send("No user found.");
        }
      } catch (error) {
        // console.error("Login error:", error);
        res.status(500).send("An error occurred during login.");
      }
    })
  );

router.get('/seed', expressAsyncHandler(
    async (req, res) => {
        try {
            const usersCount = await UserModel.countDocuments();
            if(usersCount > 0){
                res.send("Seed is already done");
                return;
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("admin123", salt);

            const adminUser = {
                id: "1",
                name: "Admin",
                surname: "admin",
                profilePhoto: "https://res.cloudinary.com/ds2qotysb/image/upload/v1687775046/n2cjwxkijhdgdrgw7zkj.png",
                emailAddress: "admin@admin.com",
                emailVerified: true,
                password: hashedPassword,
                roles: ["Admin"],
                groups: ["group1", "group2"],
                bio: "I am the admin",
                backgroundPhoto:"https://res.cloudinary.com/ds2qotysb/image/upload/v1687775046/n2cjwxkijhdgdrgw7zkj.png",
                linkedin: "https://www.linkedin.com",
                facebook: "https://www.facebook.com",
                github: "https://www.Github.com",
                instagram: "https://www.instagram.com",
                location: "Home"

            };

            const newUser = await UserModel.create(adminUser);
            const secretKey: any = process.env.JWT_SECRET;

            const token = jwt.sign(
                { _id: newUser._id, role: 'Admin' },
                secretKey,
                { expiresIn: '1d' }
            );

            // console.log("Token:", token);

            // Send the token back to the client
            res.status(200).json({ message: "Seed is done!", token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error seeding database' });
        }
    }
));

router.post("/signup", expressAsyncHandler(
    async (req, res) => {
      try {
        // console.log("Signup request received:", req.body); 
  
        const user = await UserModel.findOne({ emailAddress: req.body.emailAddress });
  
        if (user) {
          // console.log("User with this email already exists");
          res.status(409).send("User with this email already exists.");
          return;
        }
  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
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
  
        // console.log("Signup successful");
        res.status(201).send({ message: 'User created successfully' });
      } catch (error) {
        // console.error("Signup error:", error);
        res.status(500).send("An error occurred during signup.");
      }
    })
  );

router.get('/delete', expressAsyncHandler(
    async (req, res) => {
        await UserModel.deleteMany({});
        res.send("Delete is done!");
    }
));


//JAIMENS ROUTES//

//RESET PASSWORD TO ACTIVATE ACCOUNT//
// router.get('/activate_account', expressAsyncHandler(
//     async (req, res) => {
//       try{
//           const token = req.query.token;
//           res.status(200).send({ message: 'User created successfully', inviteToken: token });
//       }catch(error){
//         console.log(error);
//       }
      
//     })
// );

//CREATING A USER//
router.post("/create_user", jwtVerify(['Admin', 'Manager']), expressAsyncHandler(
    async (req, res) => {
        try {
             console.log("User creation request received:", req.body);

            // check if a user with the provided email already exists
            const existingUser = await UserModel.findOne({ emailAddress: req.body.email });

            if (existingUser) {
                // console.log("User with this email already exists");
                res.status(409).send("User with this email already exists.");
                return;
            }

            let roles: string[] = [];

            if(req.body.manager){
                roles.push("Manager");
            }

            if(req.body.technical){
                roles.push("Technical");
            }

            if(req.body.functional){
                roles.push("Functional");
            }

            // generate invite token
            const inviteToken = crypto.randomBytes(32).toString("hex");

            const userCount = await UserModel.countDocuments();
            // create new user with pending status
            const newUser = new UserModel({
                id: String(userCount + 1), // Assign the auto-incremented ID
                name: req.body.name,
                surname: req.body.surname,
                profilePhoto: req.body.profilePhoto || "https://res.cloudinary.com/ds2qotysb/image/upload/v1687775046/n2cjwxkijhdgdrgw7zkj.png",
                headerPhoto: 'https://res.cloudinary.com/ds2qotysb/image/upload/v1689762139/htddlodqzbzytxmedebh.jpg',
                emailAddress: req.body.email,
                emailVerified: false,
                inviteToken,
                roles: roles,
                groups: req.body.selectedGroups,
                password: "Admin",
                bio: '',
                github: '',
                linkedin: '',
            });

            // console.log("before save");
            await newUser.save();
            // console.log("after save");

            // Send the invitation email here, inside the same function where newUser and inviteToken are available
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "hyperiontech.capstone@gmail.com",
                    pass: "zycjmbveivhamcgt"
                }
            });

            const mailOptions = {
                from: process.env.EMAIL,
                to: newUser.emailAddress,
                subject: "Invitation to join Luna",
                html: `
                    <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 0;
                                padding: 0;
                            }
                            .email-container {
                                max-width: 600px;
                                margin: auto;
                                background-color: rgba(33, 33, 33, 1);
                                padding: 20px;
                            }
                            .header {
                                background-color: #04538E;
                                color: #fff;
                                padding: 20px;
                                text-align: center;
                            }
                            .header h1 {
                                margin: 0;
                            }
                            .logo {
                                display: block;
                                margin: 0 auto 20px;
                                width: 100px;
                                height: auto;
                            }
                            .greeting {
                                font-size: 24px;
                                color: #fff;
                                text-align: center;
                            }
                            .message {
                                font-size: 18px;
                                color: rgba(122 , 122 , 122 , 1);
                                text-align: center;
                                margin: 20px 0;
                            }
                            .activation-link {
                                display: block;
                                width: 200px;
                                margin: 20px auto;
                                padding: 10px;
                                background-color: rgba(18, 18, 18, 1);
                                color: #fff;
                                text-align: center;
                                text-decoration: none;
                                border-radius: 4px;
                            }
                            a {
                                color: #fff;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="header">
                                <img src="cid:logo" alt="Luna Logo" class="logo">
                                <h1>Welcome to Luna</h1>
                            </div>
                            <p class="greeting">Hello ${newUser.name},</p>
                            <p class="message">To complete your signup process, please click the button below.</p>
                            <a href="https://luna-backend-fc437c959bfd.herokuapp.com/api/user/activate_account?token=${inviteToken}" class="activation-link">Activate Account</a>
                        </div>
                    </body>
                    </html>
                `,
                // attachments: [
                //     {
                //         filename: 'luna-logo.png',
                //         path: 'assets/luna-logo.png',
                //         cid: 'logo'
                //     }
                // ]
            };
            

            transporter.sendMail(mailOptions);

            // console.log("User created successfully");
            res.status(201).send({ message: 'User created successfully', inviteToken, user: newUser});
        } catch (error) {
            // console.error("User creation error:", error);
            res.status(500).send("An error occurred during user creation.");
        }
    })
);

///create a router.get to display the component that is suppose to get the new password from the user
router.get('/activate_account', expressAsyncHandler(
    async (req, res) => {
        try{
            // console.log('Account activation request received:', req.query.token);
  
            const inviteToken = req.query.token;
    
            const user = await UserModel.findOne({ inviteToken });
            
            // console.log("When in here");

            if (!user) {
                // console.log('Invalid token');
                res.status(409).send('Invalid token.');
                return;
            }else{
                res.redirect(`https://luna-hyperion-tech-f8b6991d9822.herokuapp.com/activate_account/${inviteToken}`);
                // res.status(200).send({ message: 'Token Authenticated', inviteToken: inviteToken });
            }
            

            
        }catch(error){
            // console.log(error);
        }

    }
));


//ACTIVATE THE ACCOUNT WITH THE NEW PASSWORD//
router.post('/activate_account', expressAsyncHandler(
    async (req, res) => {
      try {
        // console.log('Account activation request received:', req.body);
  
        const { inviteToken, password } = req.body;
  
        // console.log('before find one');
        const user = await UserModel.findOne({ inviteToken });
        // console.log('after find one');
  
        if (!user) {
        //   console.log('Invalid token');
          res.status(409).send('Invalid token.');
          return;
        }
  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  
        user.password = hashedPassword;
        user.emailVerified = true; // Assuming the activation also verifies the email
        user.inviteToken = undefined;
  
        // console.log('before save');
        await user.save();
        const secretKey = "Jetpad2023";
        const token = jwt.sign(
            { _id: user._id, role: user.roles },
            secretKey,
            { expiresIn: '1d' }
        );
  
        // console.log('Account activated successfully');
        res.status(201).send({ message: 'Account activated successfully' });
      } catch (error) {
        // console.error('Account activation error:', error);
        res.status(500).send('An error occurred during account activation.');
      }
    //   console.log(req.body);
    })
  );

//DASH"S ROUTES//
//UPDATE USER NAME - WORKING

router.post('/get_user_by_token', jwtVerify(['Admin', 'Manager', 'Technical', 'Functional']), async (req, res) => {
try {
    const { token } = req.body;

    const user = await UserModel.findOne({ inviteToken: token });
    if (!user) {
    return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ email: user.emailAddress });
} catch (error) {
    // console.error('Error retrieving user by token:', error);
    res.status(500).json({ error: 'An error occurred while retrieving user by token' });
}
});

router.put('/update_user_name', jwtVerify(['Admin', 'Manager', 'Technical', 'Functional']) ,expressAsyncHandler(
    async (req, res) => {
        try{
            const { name, email } = req.body;
            // console.log("email: " + email);
            // console.log("name: " + name);

            const user = await UserModel.findOneAndUpdate(
                { emailAddress: email },
                {
                  $set: {
                    name: name
                  }
                },
                { new: true }
            );

            // console.log("user: ", user);
        
            if (user) {
                res.status(200).json({ message: 'User name updated successfuly' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }

        }catch(error){
            // console.log(error);
            res.status(500).send({ error: 'Internal server error' });
        }
    }
))
//UPDATE USER PASSWORD - WORKING
router.put('/update_user_password',jwtVerify(['Admin', 'Manager', 'Technical', 'Functional']), expressAsyncHandler(
    async (req, res) => {
        try{
            const { password, email } = req.body;
            // console.log("email: " + email);

            const user = await UserModel.findOneAndUpdate(
                { emailAddress: email },
                {
                  $set: {
                    password: password,
                  }
                },
                { new: true }
            );
        
            if (user) {
                res.status(200).json({ message: 'User password updated successfuly' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }

        }catch(error){
            // console.log(error);
            res.status(500).send({ error: 'Internal server error' });
        }
    }
))
//UPDATE USER Location - WORKING
router.put('/update_user_location', jwtVerify(['Admin', 'Manager', 'Technical', 'Functional']), expressAsyncHandler(
    async (req, res,next) => {
        try{
            const { location, email } = req.body;
            // console.log("email: " + email);

            const user = await UserModel.findOneAndUpdate(
                { emailAddress: email },
                {
                  $set: {
                    location: location
                  }
                },
                { new: true }
            );
        
            if (user) {
                res.status(200).json({ message: 'User location updated successfuly' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }

        }catch(error){
            // console.log(error);
            res.status(500).send({ error: 'Internal server error' });
        }
    }
))

//UPDATE USER Facebook - 
router.put('/update_user_facebook',jwtVerify(['Admin', 'Manager', 'Technical', 'Functional']), expressAsyncHandler(
    async (req, res,next) => {
        try{
            const { facebook, email } = req.body;
            // console.log("email: " + email);
            // console.log("Facebook:"+ facebook);
            const user = await UserModel.findOneAndUpdate(
                { emailAddress: email },
                {
                  $set: {
                    facebook: facebook
                  }
                },
                { new: true }
            );
        
            if (user) {
                res.status(200).json({ message: 'User facebook updated successfuly' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }

        }catch(error){
            // console.log(error);
            res.status(500).send({ error: 'Internal server error' });
        }
    }
))

//UPDATE USER INSTAGRAM - 
router.put('/update_user_instagram', jwtVerify(['Admin', 'Manager', 'Technical', 'Functional']), expressAsyncHandler(
    async (req, res,next) => {
        try{
            const { instagram, email } = req.body;
            // console.log("email: " + email);

            const user = await UserModel.findOneAndUpdate(
                { emailAddress: email },
                {
                  $set: {
                    instagram: instagram
                  }
                },
                { new: true }
            );
        
            if (user) {
                res.status(200).json({ message: 'User instagram updated successfuly' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }

        }catch(error){
            // console.log(error);
            res.status(500).send({ error: 'Internal server error' });
        }
    }
))

//UPDATE USER GITHUB - 
router.put('/update_user_github', jwtVerify(['Admin', 'Manager', 'Technical', 'Functional']),expressAsyncHandler(
    async (req, res,next) => {
        try{
            const { github, email } = req.body;
            // console.log("email: " + email);

            const user = await UserModel.findOneAndUpdate(
                { emailAddress: email },
                {
                  $set: {
                    github: github
                  }
                },
                { new: true }
            );
        
            if (user) {
                res.status(200).json({ message: 'User Github updated successfuly' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }

        }catch(error){
            // console.log(error);
            res.status(500).send({ error: 'Internal server error' });
        }
    }
))

//UPDATE USER GITHUB - 
router.put('/update_user_linkedin', jwtVerify(['Admin', 'Manager', 'Technical', 'Functional']), expressAsyncHandler(
    async (req, res,next) => {
        try{
            const { linkedin, email } = req.body;
            // console.log("email: " + email);

            const user = await UserModel.findOneAndUpdate(
                { emailAddress: email },
                {
                  $set: {
                    linkedin: linkedin
                  }
                },
                { new: true }
            );
        
            if (user) {
                res.status(200).json({ message: 'User Linkedin updated successfuly' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }

        }catch(error){
            // console.log(error);
            res.status(500).send({ error: 'Internal server error' });
        }
    }
))

//GET USER
router.get('/id', jwtVerify(['Admin', 'Manager', 'Technical', 'Functional']), expressAsyncHandler(
    async (req, res) => {
        // const id = String(req.query.id);
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     res.status(400).send('Invalid ObjectId');
        //     return;
        // }

        // const objectId = new mongoose.Types.ObjectId(id);

        const user = await UserModel.findOne({ id: req.query.id });
        if(user){
            res.status(200).send(user);
        }else{
            res.status(404).send("Id not found");
        }
    }
));



router.get('/email', expressAsyncHandler(
    async (req, res) => {
        const user = await UserModel.findOne({ emailAddress: req.query.email });
        if(user){
            res.status(200).send(user);
        }else{
            res.status(404).send("Id not found");
        }
    }
));

router.post('/:id/add-group', expressAsyncHandler(
    async (req, res) => {
        const groupId = req.body.groupId;
        const user = await UserModel.findById(req.params.id);
        if (user) {
            user.groups.push(groupId);
            const updatedUser = await user.save();
            res.send(updatedUser);
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    }
));
/* THESE ARE DIFFERENT FUNCTIONS, DO NOT DELETE EITHER */
router.post('/add-group-to-users', expressAsyncHandler(
  async (req, res) => {
    const groupId = req.body.groupId;
    const userIds = req.body.userIds;
    console.log('in add-group-to-users, group id: ' + groupId);

    try {
      const users = await UserModel.updateMany(
        { _id: { $in: userIds } },
        { $addToSet: { groups: groupId } }
      );

      res.status(201).send(users);
    }
    catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while adding the group to the users");
    }
  }  
));


router.get('/:id', expressAsyncHandler(
    async (req, res) => {
        const user = await UserModel.findById(req.params.id);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send("User not found");
        }
    }
));
router.delete('/:userId/group/:groupId', expressAsyncHandler(
    async(req,res) => {
        const user = await UserModel.findById(req.params.userId);
        if (user) {
            const groupIndex = user.groups.indexOf(req.params.groupId);
            if (groupIndex !== -1) {
                user.groups.splice(groupIndex,1);
                const updatedUser = await user.save();
                res.status(200).send({message: "Group removed from user's groups", user:updatedUser});
            } else {
                res.status(404).send({ message: "Group not found in user's groups" });
            }
        } else {
            res.status(404).send("User not found");
        }
    }
))

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }
      console.log('in upload router');
      const result = await cloudinary.uploader.upload(req.file.path);
      console.log("result is: ", result);
      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      res.status(500).json({ message: 'File upload error' });
    }
});

router.put('/updateProfilePicture', jwtVerify(['Admin', 'Manager', 'Technical', 'Functional']), async (req, res) => {
    try {
      const { userId, url } = req.body;
      const result = await UserModel.updateOne({ id: userId }, { profilePhoto: url });
  
      if (!result) {
        res.status(400).json({ message: 'No user found with the provided ID or no update was needed.' });
      } else {
        res.status(200).json({ message: 'Profile picture updated successfully.' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating profile picture', error: error.message });
    }
  });
  
  router.put('/updateProfileHeader', jwtVerify(['Admin', 'Manager', 'Technical', 'Functional']), async (req, res) => {
    try {
      const { userId, url } = req.body;
      const result = await UserModel.updateOne({ id: userId }, { headerPhoto: url });
  
      if (!result) {
        res.status(400).json({ message: 'No user found with the provided ID or no update was needed.' });
      } else {
        res.status(200).json({ message: 'Profile header updated successfully.' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating profile header', error: error.message });
    }
  });

  router.put('/updateBio', jwtVerify(['Admin', 'Manager', 'Technical', 'Functional']) , async (req, res) => {
    try {
      const { userId, bio } = req.body;
      const result = await UserModel.updateOne({ id: userId }, { bio: bio });
  
      if (!result) {
        res.status(400).json({ message: 'No user found with the provided ID or no update was needed.' });
      } else {
        res.status(200).json({ message: 'Bio updated successfully.' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating bio', error: error.message });
    }
  });

  router.put('/updateGithub', jwtVerify(['Admin', 'Manager', 'Technical', 'Functional']), async (req, res) => {
    try {
      const { userId, githubLink } = req.body;
      const result = await UserModel.updateOne({ id: userId }, { github: githubLink });
  
      if (!result) {
        res.status(400).json({ message: 'No user found with the provided ID or no update was needed.' });
      } else {
        res.status(200).json({ message: 'Github link updated successfully.' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating Github link', error: error.message });
    }
  });
  
  router.put('/updateLinkedin', jwtVerify(['Admin', 'Manager', 'Technical', 'Functional']), async (req, res) => {
    try {
      const { userId, linkedinLink } = req.body;
      const result = await UserModel.updateOne({ id: userId }, { linkedin: linkedinLink });
  
      if (!result) {
        res.status(400).json({ message: 'No user found with the provided ID or no update was needed.' });
      } else {
        res.status(200).json({ message: 'LinkedIn link updated successfully.' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating LinkedIn link', error: error.message });
    }
  });
  
router.post('/addGroup' , jwtVerify(['Admin', 'Manager']), expressAsyncHandler(
    async (req, res) => {
        try {
            const user = await UserModel.findById(req.body.userId);
            if(user) {
                user.groups.push(req.body.groupId);
                await user.save();
                res.status(201).send(user);
            } else {
                res.status(404).send("User not found");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("An error occurred during user update");
        }
    }
));

router.get("/byGroup/:groupId", expressAsyncHandler(async (req, res) => {
    const groupId = req.params.groupId;
    const users = await UserModel.find({ groups: { $in: [groupId] } });
    const userArray = users.map((user: any) => ({ 
        id: user.id, 
        name: user.name, 
        surname: user.surname, 
        emailAddress: user.emailAddress, 
        roles: user.roles[0],
        profilePhoto: user.profilePhoto
    }));
    console.log(userArray);
    res.send(userArray);
}));

router.get("/email/:userEmail", jwtVerify(['Admin', 'Manager', 'Technical', 'Functional']), expressAsyncHandler(async (req, res) => {
    const userEmail = decodeURIComponent(req.params.userEmail);
    const user = await UserModel.findOne({ emailAddress: userEmail });
  
    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }
  
    res.send(user);
  }));


router.get('/:id', expressAsyncHandler(
    async (req, res) => {
        const user = await UserModel.findById(req.params.id);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send("User not found");
        }
    }
));

router.get("/userByEmail/:email", expressAsyncHandler(async (req, res) => {
    const userEmail = decodeURIComponent(req.params.email);

    const user = await UserModel.findOne({ emailAddress: userEmail });

    if (!user) {
        res.status(404).send({ message: 'User not found'});
        return;
    }

    res.send(user);
}));

//UPDATE USER BACKGROUND PICTURE -
router.put('/update_background_picture',upload.single('file'),expressAsyncHandler(
    async (req,res)=> {
        try{
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }
            const result = await cloudinary.uploader.upload(req.file.path);
            const { email } = req.body;
            const user = await UserModel.findOneAndUpdate(
                { emailAddress: email },
                {
                  $set: {
                    backgroundPhoto: result.secure_url,
                  }
                },
                { new: true }
            );
            if (user) {
                res.status(200).json({ message: 'User background photo updated successfuly', url: result.secure_url });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        }catch(error){
            // console.log(error);
            res.status(500).send({ error: 'Internal server error' });
        }
    }
));

//UPDATE USER BIO - WORKING
router.put('/update_user_bio',expressAsyncHandler(
    async (req, res,next) => {
        try{
            const { bio, email } = req.body;
            // console.log("email: " + email);
            console.log("bio:"+bio);
            const user = await UserModel.findOneAndUpdate(
                { emailAddress: email },
                {
                  $set: {
                    bio: bio
                  }
                },
                { new: true }
            );
        
            if (user) {
                res.status(200).json({ message: 'User bio updated successfuly' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }

        }catch(error){
            // console.log(error);
            res.status(500).send({ error: 'Internal server error' });
        }
    }
));


export default router;
