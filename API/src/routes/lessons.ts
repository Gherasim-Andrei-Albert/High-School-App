import express from 'express';
import { getLogger } from '@/utils/loggers';
import { Student } from '../../models/student';
import { Teacher } from '../../models/teacher';
import { User } from '../../models/user';
import { Lesson } from '../../models/lesson';
const router = express.Router();
const logger = getLogger('INDEX_ROUTE');
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
    let lessons: Lesson[] | undefined = [];
    if(user?.teacherDetails) {
      lessons = await user.teacherDetails.$get('lessons');
    }
    if(user?.studentDetails) {
      const group = await user.studentDetails.$get('group');
      lessons = await group?.$get('lessons');
    }
    res.json({ lessons });
  } catch (err) {
    return next(err)
  }
});

export default router;
