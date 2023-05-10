import express from 'express';
// import { getLogger } from '@/utils/loggers';
import { Student } from '../../models/student';
import { Teacher } from '../../models/teacher';
import { User } from '../../models/user';
import { Lesson } from '../../models/lesson';
import { Group } from '../../models/group';
const router = express.Router();
// const logger = getLogger('INDEX_ROUTE');
declare module "express-serve-static-core" {
  interface Request {
    user: {_id: string};
  }
}

router.get('/', async function (req, res, next) {
  try {
    const user = await User.findOne({
      where: {
        id: req.user._id
      },
      include:[Teacher, Student]
    });
    if(user?.teacherDetails) {
      let groups = (await Group.findAll({ include: [Lesson, Student] }))
        .filter(group => group.lessons.find(
          lesson => lesson.teacherId === user.teacherDetails.id
        ));
      return res.json({groups});
    }
    return res.status(403).json({msg:'User is not a teacher.'})
  } catch (err) {
    return next(err)
  }
});

export default router;
