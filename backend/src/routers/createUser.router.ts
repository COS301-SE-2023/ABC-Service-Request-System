import { Router } from 'express';
import createUserRouter from '../controllers/createUser.controller';
import expressAsyncHandler from 'express-async-handler';

const router = Router();

router.use('/', createUserRouter);


router.get(
    "/activateAccount",
    expressAsyncHandler(async (req, res) => {
  
      try{
          const token = req.query.token;
          res.status(200).send({ message: 'User created successfully', inviteToken: token });
     
      }catch(error){
        console.log(error);
      }
      
    })
  );

  
export default router;
