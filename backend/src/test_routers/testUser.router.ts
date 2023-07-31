import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { TestUserModel } from "./testUser.model";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from 'bcryptjs';       
import multer, {Multer} from "multer";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.get('/', expressAsyncHandler(
    async (req, res) => {
        const users = await TestUserModel.find();
        res.send(users);
    }
));

router.post("/login", expressAsyncHandler(
    async (req, res) => {
        const user = await TestUserModel.findOne({ emailAddress: req.body.emailAddress }).select("+password");
  
        if (user) {  
          const validPassword = await bcrypt.compare(req.body.password, user.password);
  
          if (!validPassword) {
            res.status(401).send({ auth: false, token: null });
            return;
          }
  
          const secretKey = process.env.JWT_SECRET;
  
          if (!secretKey) {
            throw new Error('JWT Secret is not defined');
          }
          
          //loop through roles and add them to the token
          let setRoles: string[] = [];
          setRoles = user.roles;

          const token = jwt.sign({ _id: user._id, role: setRoles , user: user, name: user.name , objectName: "UserInfo"}, secretKey, {
            expiresIn: 86400, // expires in 24 hours
          });
  
          // console.log("Login successful");
          res.status(200).send({ auth: true, token });
        } else {
          // console.log("User not found");
          res.status(404).send({message: "No user found."});
        }
    })
  );

router.get('/seed', expressAsyncHandler(
    async (req, res) => {
        try {
            const usersCount = await TestUserModel.countDocuments();
            if(usersCount > 0){
                res.status(401).send({message: "Seed is already done"});
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
                groups: [],
                bio: "I am the admin",
                headerPhoto:"https://res.cloudinary.com/ds2qotysb/image/upload/v1687775046/n2cjwxkijhdgdrgw7zkj.png",
                linkedin: "https://www.linkedin.com",
                github: "https://www.Github.com",
            };

            const newUser = await TestUserModel.create(adminUser);
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

router.get('/delete', expressAsyncHandler(
    async (req, res) => {
        await TestUserModel.deleteMany({});
        res.status(200).send({message: "Delete is done!"});
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
router.post("/create_user", expressAsyncHandler(
    async (req, res) => {
        try {
            //  console.log("User creation request received:", req.body);

            // check if a user with the provided email already exists
            const existingUser = await TestUserModel.findOne({ emailAddress: req.body.email });

            if (existingUser) {
                // console.log("User with this email already exists");
                res.status(409).send({message: "User with this email already exists."});
                return;
            }

            let roles: string[] = [];

            if(req.body.manager){
                roles.push("Manager");
            }

            if(req.body.technical){
                roles.push("Technical");
            }

            if(req.body.Functional){
                roles.push("Functional");
            }

            // generate invite token
            const inviteToken = crypto.randomBytes(32).toString("hex");

            const userCount = await TestUserModel.countDocuments();
            // create new user with pending status
            const newUser = new TestUserModel({
                id: String(userCount + 1), // Assign the auto-incremented ID
                name: req.body.name,
                surname: req.body.surname,
                profilePhoto: req.body.profilePhoto || "https://res.cloudinary.com/ds2qotysb/image/upload/v1687775046/n2cjwxkijhdgdrgw7zkj.png",
                headerPhoto: 'https://res.cloudinary.com/ds2qotysb/image/upload/v1689762139/htddlodqzbzytxmedebh.jpg',
                emailAddress: req.body.email,
                inviteToken,
                status: "pending",
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
                            <a href="http://localhost:3000/api/user/activate_account?token=${inviteToken}" class="activation-link">Activate Account</a>
                        </div>
                    </body>
                    </html>
                `,
                attachments: [
                    {
                        filename: 'luna-logo.png',
                        path: 'assets/luna-logo.png',
                        cid: 'logo'
                    }
                ]
            };
            

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    // console.log(error);
                } else {
                    // console.log("Email sent: " + info.response);
                }
            });

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
        // console.log('Account activation request received:', req.query.token);

        const inviteToken = req.query.token;

        const user = await TestUserModel.findOne({ inviteToken });
        
        // console.log("When in here");

        if (!user) {
            // console.log('Invalid token');
            res.status(409).send({message: 'Invalid token.'});
            return;
        }else{
            res.status(200).send({message: 'valid token'});
            // res.status(200).send({ message: 'Token Authenticated', inviteToken: inviteToken });
        }

    }
));


//ACTIVATE THE ACCOUNT WITH THE NEW PASSWORD//
router.post('/activate_account' , expressAsyncHandler(
    async (req, res) => {
  
        const { inviteToken, password } = req.body;
  
        // console.log('before find one');
        const user = await TestUserModel.findOne({ inviteToken });
        // console.log('after find one');
  
        if (!user) {
        //   console.log('Invalid token');
          res.status(409).send({message: 'Invalid token.'});
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
      
    })
  );

//DASH"S ROUTES//
//UPDATE USER NAME - WORKING

router.post('/get_user_by_token', async (req, res) => {
    const { token } = req.body;

    const user = await TestUserModel.findOne({ inviteToken: token });

    if (!user) {
        res.status(404).send({ error: 'User not found' });
    } else {
        res.status(200).send({ email: user.emailAddress });
    }
});

router.put('/update_user_name' ,expressAsyncHandler(
    async (req, res) => {
        const { name, email } = req.body;
        // console.log("email: " + email);
        // console.log("name: " + name);

        const user = await TestUserModel.findOneAndUpdate(
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
    }
))
//UPDATE USER PASSWORD - WORKING
router.put('/update_user_password', expressAsyncHandler(
    async (req, res) => {
        const { password, email } = req.body;
        // console.log("email: " + email);

        const user = await TestUserModel.findOneAndUpdate(
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
    }
))
//UPDATE USER Location - WORKING
router.put('/update_user_location', expressAsyncHandler(
    async (req, res,next) => {
        const { location, email } = req.body;
        // console.log("email: " + email);

        const user = await TestUserModel.findOneAndUpdate(
            { emailAddress: email },
            {
                $set: {
                location: location
                }
            },
            { new: true }
        );
    
        if (user) {
            res.status(200).json({ message: 'User location updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }
))

//UPDATE USER GITHUB - 
router.put('/update_user_github',expressAsyncHandler(
    async (req, res,next) => {
        const { github, email } = req.body;
        // console.log("email: " + email);

        const user = await TestUserModel.findOneAndUpdate(
            { emailAddress: email },
            {
                $set: {
                github: github
                }
            },
            { new: true }
        );
    
        if (user) {
            res.status(200).json({ message: 'User Github updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }
))

//UPDATE USER GITHUB - 
router.put('/update_user_linkedin', expressAsyncHandler(
    async (req, res,next) => {
        const { linkedin, email } = req.body;
        // console.log("email: " + email);

        const user = await TestUserModel.findOneAndUpdate(
            { emailAddress: email },
            {
                $set: {
                linkedin: linkedin
                }
            },
            { new: true }
        );
    
        if (user) {
            res.status(200).json({ message: 'User Linkedin updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }
))

//GET USER
router.get('/id', expressAsyncHandler(
    async (req, res) => {
        const user = await TestUserModel.findOne({ id: req.query.id });
        if(user){
            res.status(200).send(user);
        }else{
            res.status(404).send({message: "Id not found"});
        }
    }
));



router.get('/email', expressAsyncHandler(
    async (req, res) => {
        const user = await TestUserModel.findOne({ emailAddress: req.query.email });
        if(user){
            res.status(200).send(user);
        }else{
            res.status(404).send({message: "Id not found"});
        }
    }
));

router.post('/:id/add-group', expressAsyncHandler(
    async (req, res) => {
        const groupId = req.body.groupId;
        const user = await TestUserModel.findById(req.params.id);
        if (user) {
            user.groups.push(groupId);
            const updatedUser = await user.save();
            res.status(200).send(updatedUser);
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

    try {
      const users = await TestUserModel.updateMany(
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
        const user = await TestUserModel.findById(req.params.id);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send("User not found");
        }
    }
));
router.delete('/:userId/group/:groupId', expressAsyncHandler(
    async(req,res) => {
        const user = await TestUserModel.findById(req.params.userId);
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
            res.status(404).send({message: "User not found"});
        }
    }
))

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.put('/updateProfilePicture', async (req, res) => {
    try {
      const { userId, url } = req.body;
      const result = await TestUserModel.updateOne({ id: userId }, { profilePhoto: url });
  
      if (result.modifiedCount <= 0) {
        res.status(400).json({ message: 'No user found with the provided ID or no update was needed.' });
      } else {
        res.status(200).json({ message: 'Profile picture updated successfully.' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating profile picture', error: error.message });
    }
  });
  
  router.put('/updateProfileHeader', async (req, res) => {
    try {
      const { userId, url } = req.body;
      const result = await TestUserModel.updateOne({ id: userId }, { headerPhoto: url });
  
      if (result.modifiedCount <= 0) {
        res.status(400).json({ message: 'No user found with the provided ID or no update was needed.' });
      } else {
        res.status(200).json({ message: 'Profile header updated successfully.' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating profile header', error: error.message });
    }
  });

  router.put('/updateBio' , async (req, res) => {
    try {
      const { userId, bio } = req.body;
      const result = await TestUserModel.updateOne({ id: userId }, { bio: bio });
  
      if (result.modifiedCount <= 0) {
        res.status(400).json({ message: 'No user found with the provided ID or no update was needed.' });
      } else {
        res.status(200).json({ message: 'Bio updated successfully.' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating bio', error: error.message });
    }
  });

  router.put('/updateGithub', async (req, res) => {
    try {
      const { userId, githubLink } = req.body;
      const result = await TestUserModel.updateOne({ id: userId }, { github: githubLink });
  
      if (result.modifiedCount <= 0) {
        res.status(400).json({ message: 'No user found with the provided ID or no update was needed.' });
      } else {
        res.status(200).json({ message: 'Github link updated successfully.' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating Github link', error: error.message });
    }
  });
  
  router.put('/updateLinkedin', async (req, res) => {
    try {
      const { userId, linkedinLink } = req.body;
      const result = await TestUserModel.updateOne({ id: userId }, { linkedin: linkedinLink });
  
      if (result.modifiedCount <= 0) {
        res.status(400).json({ message: 'No user found with the provided ID or no update was needed.' });
      } else {
        res.status(200).json({ message: 'LinkedIn link updated successfully.' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating LinkedIn link', error: error.message });
    }
  });
  
router.post('/addGroup' , expressAsyncHandler(
    async (req, res) => {
        try {
            const user = await TestUserModel.findById(req.body.userId);
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


router.get("/email/:userEmail", expressAsyncHandler(async (req, res) => {
    const userEmail = decodeURIComponent(req.params.userEmail);
    const user = await TestUserModel.findOne({ emailAddress: userEmail });
  
    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }
  
    res.status(200).send(user);
  }));

  

router.get('/:id', expressAsyncHandler(
    async (req, res) => {
        const user = await TestUserModel.findById(req.params.id);
        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send({message: "User not found"});
        }
    }
));

//UPDATE USER BACKGROUND PICTURE -
router.put('/update_background_picture',upload.single('file'),expressAsyncHandler(
    async (req,res)=> {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const { email } = req.body;
        const user = await TestUserModel.findOneAndUpdate(
            { emailAddress: email },
            {
                $set: {
                backgroundPhoto: req.file.path,
                }
            },
            { new: true }
        );
        if (user) {
            res.status(200).send({ message: 'User background photo updated successfuly', url: req.file.path });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    }
));

//UPDATE USER BIO - WORKING
router.put('/update_user_bio',expressAsyncHandler(
    async (req, res,next) => {
        const { bio, email } = req.body;

        const user = await TestUserModel.findOneAndUpdate(
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
    }
));


export default router;
