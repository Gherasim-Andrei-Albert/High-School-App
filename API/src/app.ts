
import express, { RequestHandler, } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', 'config.env') });

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import tokensRouter from './routes/tokens';
import { User } from '../models/user';
import { PersonDetails } from '../models/personDetails';
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
      pool: {
        max: 1,
        min: 1,
        idle: 10000
      },
      models: [
        User,
        PersonDetails,
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
  }

}

export default new App().app;

