import express from 'express';
// import passport from '../middlewares/auth';
import { getLogger } from '@/utils/loggers';
// import { User } from 'models/user';
const router = express.Router();
const logger = getLogger('INDEX_ROUTE');
import { User } from '../../models/user';
import { Express } from "express-serve-static-core";
import { use } from 'passport';
import { Teacher } from '../../models/teacher';
import { Student } from '../../models/student';
import { Mark } from '../../models/mark';
import { Group } from '../../models/group';
import { Classroom } from 'models/classroom';
import { Lesson } from '../../models/lesson';
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
      include:[Student, Teacher]
    });
    if (user?.studentDetails) {
      const marks = await user?.studentDetails.$get('marks');
      return res.json({ marks });
    }
    if (user?.teacherDetails) {
      const lessons = await user?.teacherDetails.$get('lessons');
      const marks = (await Promise.all(
        lessons.map(async lesson => await lesson.$get('marks'))
      )).flat();
      return res.json({ marks });
    }
    return res.status(403).json({msg: 'User is not a teacher or student.'})
  } catch (err) {
    return next(err)
  }
});

router.post('/', async function (req, res, next) {
  try {
    const { subjectId, student: studentData, weekday, startTime, value } = req.body;
    const user = await User.findOne({
      where: {
        id: req.user._id
      },
      include:[Teacher]
    });
    if (!user?.teacherDetails) {
      return res.status(403).json({msg:'User is not a teacher.'})
    }
    const student = await Student.findOne({
      where: {
        firstName: studentData.firstName,
        lastName: studentData.lastName,
      }
    });
    const lesson = await Lesson.findOne({
      where: {
        teacherId: user?.teacherDetails.id,
        subjectId,
        groupId: student?.groupId,
        weekday,
        startTime
      }
    });
    await Mark.create({
      studentId: student?.id,
      lessonId: lesson?.id,
      value
    });
    return res.json({ msg: 'Mark added successfuly' });
  } catch (err) {
    return next(err)
  }
});

export default router;
