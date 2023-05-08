import { Table, Column, Model, HasOne } from 'sequelize-typescript';
import { Parent } from './parent';
import { Student } from './student';
import { Teacher } from './teacher';
import { PersonDetails } from './personDetails';

@Table
export class User extends Model {
  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true,
    },
  })
  email: string;

  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  hashedPassword: string;

  @Column({
    allowNull: false,
    defaultValue: false,
    validate: {
      notEmpty: true,
    },
  })
  isAdmin: boolean;

  @HasOne(() => PersonDetails)
  personDetails: PersonDetails;

  @HasOne(() => Teacher)
  teacherDetails: Teacher;

  @HasOne(() => Parent)
  parentDetails: Parent;

  @HasOne(() => Student)
  studentDetails: Student;
}
