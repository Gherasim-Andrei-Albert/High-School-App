
import express, { RequestHandler, } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', 'config.env') });
import passport from './middlewares/auth';
import cors from 'cors';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import tokensRouter from './routes/tokens';
import groupsRouter from './routes/groups';
import lessonsRouter from './routes/lessons';
import marksRouter from './routes/marks';
import absencesRouter from './routes/absences';
import { User } from '../models/user';
import { Subject } from '../models/subject';
import { Teacher } from '../models/teacher';
import { TeacherSubjectAssignment } from '../models/teacherSubjectAssignment';
import { Group } from '../models/group';
import { Parent } from '../models/parent';
import { Student } from '../models/student';
import { Classroom } from '../models/classroom';
import { Lesson } from '../models/lesson';
import { Mark } from '../models/mark';
import { Absence } from '../models/absence';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routerSetup();
  }

  private config() {

    this.app.use(logger('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, 'public')));
    
    const sequelize = new Sequelize({
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      dialect: 'mysql',
      dialectOptions: {
        connectTimeout: 100000
      },
      // pool: {
      //   max: 1,
      //   min: 1,
      //   idle: 10000
      // },
      models: [
        User,
        Subject,
        Teacher,
        TeacherSubjectAssignment,
        Group,
        Parent,
        Student,
        Classroom,
        Lesson,
        Mark,
        Absence
      ],
    });
  }

  private routerSetup() {
    this.app.use('/', indexRouter);
    this.app.use('/users', usersRouter);
    this.app.use('/tokens', tokensRouter);
    this.app.use('/lessons',
      passport.authenticate('jwt', { session: false }), lessonsRouter);
    this.app.use('/groups',
      passport.authenticate('jwt', { session: false }), groupsRouter);
    this.app.use('/marks',
      passport.authenticate('jwt', { session: false }), marksRouter);
    this.app.use('/absences',
      passport.authenticate('jwt', { session: false }), absencesRouter);

    this.app.use((err: any, req: any, res: any, next: any) => {
      console.log(err);
      res.status(err.status || 500);
      res.json({ msg: 'An error occured.' });
    });
  }

}

export default new App().app;

