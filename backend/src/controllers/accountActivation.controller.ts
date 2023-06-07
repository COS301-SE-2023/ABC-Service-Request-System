import { Router } from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import { UserModel } from '../models/user.model';

const router = Router();

router.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      console.log('Account activation request received:', req.body);

      const { inviteToken, password } = req.body;
      

      const user = await UserModel.findOne({ inviteToken });

      if (!user) {
        console.log('Invalid token');
        res.status(409).send('Invalid token.');
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user.password = hashedPassword;
      user.emailVerified = true; // Assuming the activation also verifies the email
      user.inviteToken = undefined;

      await user.save();

      console.log('Account activated successfully');
      res.status(201).send({ message: 'Account activated successfully' });
    } catch (error) {
      console.error('Account activation error:', error);
      res.status(500).send('An error occurred during account activation.');
    }
    console.log(req.body);
  })
);

export default router;
