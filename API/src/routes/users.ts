import express from 'express';
import { getLogger } from '@/utils/loggers';
import passport from '../middlewares/auth';
import { User } from '../../models/user';
import { PersonDetails } from '../../models/personDetails';
const router = express.Router();
const logger = getLogger('USER_ROUTE');
import {ValidationError} from 'sequelize';
import { Teacher } from '../../models/teacher';
import { Student } from '../../models/student';
import { Group } from '../../models/group';

router.post('/', async (req, res, next) => {
  passport.authenticate('signup', { session: false },
    async (err: any, user: User, info: any) => { 
      try {
        if (err) {
          return res.status(500).json({msg: 'An error occurred.'});
        }

        user.personDetails = await PersonDetails.create(
          (({ firstName, lastName, phone, address }) =>
            ({
              associatedAccountId: user.id,
              firstName,
              lastName,
              phone,
              address
            })
          )(req.body)
        );

        switch (req.body.type) {
          case 'teacher':
            user.teacherDetails = await Teacher.create({
              accountId: user.id
            });
            break;
          case 'student':
            const group = await Group.findOne({
              where: {
                name: req.body.groupName,
                grade: req.body.grade
              }
            });
            
            if (!group) {
              return res.status(400).json({msg: 'Payload not valid.'})
            }

            user.studentDetails = await Student.create({
              accountId: user.id,
              groupId: group.id,
              grade: req.body.grade,
              enrolmentYear: req.body.enrolmentYear
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
