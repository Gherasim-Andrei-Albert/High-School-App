import express from 'express';
// import passport from '../middlewares/auth';
// import { getLogger } from '@/utils/loggers';
// import { User } from 'models/user';
const router = express.Router();
// const logger = getLogger('INDEX_ROUTE');
import { User } from '../../models/user';
import { Express } from "express-serve-static-core";
import { use } from 'passport';
import { Teacher } from '../../models/teacher';
import { Student } from '../../models/student';
import { Mark } from '../../models/mark';
import { Group } from '../../models/group';
import { Classroom } from 'models/classroom';
import { Lesson } from '../../models/lesson';
import { Absence } from '../../models/absence';
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
      let absences = await user?.studentDetails.$get('absences');
      let absencesResponse = await Promise.all(
        absences.map(async absence => {
          const lesson = await absence.$get('lesson');
          const subject = await lesson?.$get('subject');
          const teacher = await lesson?.$get('teacher');
          return { absenceDetails: absence, lesson, subject, teacher };
        })
      );
      return res.json({ absences: absencesResponse });
    }
    if (user?.teacherDetails) {
      const lessons = await user?.teacherDetails.$get('lessons');
      const absences = (await Promise.all(
        lessons.map(async lesson => await lesson.$get('absences'))
      )).flat();
      return res.json({ absences });
    }
    return res.status(403).json({msg: 'User is not a teacher or student.'})
  } catch (err) {
    return next(err)
  }
});

router.post('/', async function (req, res, next) {
  try {
    const { studentId, lessonId } = req.body;
    const user = await User.findOne({
      where: {
        id: req.user._id
      },
      include:[Teacher]
    });
    if (!user?.teacherDetails) {
      return res.status(403).json({msg:'User is not a teacher.'})
    }
    await Absence.create({studentId, lessonId});
    return res.json({ msg: 'Absence added successfuly' });
  } catch (err) {
    return next(err)
  }
});

export default router;
