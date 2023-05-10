import express from 'express';
import { getLogger } from '@/utils/loggers';
import passport from '../middlewares/auth';
import { User } from '../../models/user';
const router = express.Router();
const logger = getLogger('USER_ROUTE');
import {ValidationError} from 'sequelize';
import { Teacher } from '../../models/teacher';
import { Student } from '../../models/student';
import { Group } from '../../models/group';
declare module "express-serve-static-core" {
  interface Request {
    user: {_id: string};
  }
}

router.get('/', passport.authenticate('jwt', { session: false }),
  async (req, res, next) => { 
    try {
      const user = await User.findOne({
        where: {
          id: req.user._id
        },
        include:[Student, Teacher]
      });
      if (!user) return res.status(500);
      return res.json({ user});
    } catch (err) {
      return next(err)
    }
  }
);

router.post('/', async (req, res, next) => {
  passport.authenticate('signup', { session: false },
    async (err: any, user: User, info: any) => { 
      try {
        if (err) {
          return res.status(500).json({msg: 'An error occurred.'});
        }

        const {
          type: accountType,
          firstName,
          lastName,
          phone,
          address,
          grade,
          enrolmentYear,
        } = req.body;

        switch (accountType) {
          case 'teacher':
            user.teacherDetails = await Teacher.create({
              accountId: user.id,
              firstName,
              lastName,
              phone,
              address,
            });
            break;
          case 'student':
            const group = await Group.findOne({
              where: {
                name: req.body.groupName,
                grade: req.body.grade,
              }
            });
            
            if (!group) {
              return res.status(400).json({msg: 'Payload not valid.'})
            }

            user.studentDetails = await Student.create({
              accountId: user.id,
              groupId: group.id,
              grade,
              enrolmentYear,
              firstName,
              lastName,
              phone,
              address,
            });
            break;
          
          default:
            return res.status(400).json({msg: 'Payload not valid.'})
        }

        return res.json({message: 'Signup successful'});
      }
      catch (err) {
        if(err instanceof ValidationError) {
          return res.status(400).json({msg: 'Payload not valid.'});
        }

        return res.status(500).json({msg: 'An error occurred.'})
      }
    }
  )(req, res, next);
});

export default router;
