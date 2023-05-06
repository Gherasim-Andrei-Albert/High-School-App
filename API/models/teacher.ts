import { Table, Column, Model, HasMany, BelongsToMany, HasOne } from 'sequelize-typescript';
import { Lesson } from './lesson';
import { Subject } from './subject';
import { TeacherSubjectAssignment } from './teachersubjectassignment';
import { Group } from './group';

@Table
export class Teacher extends Model {
  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  firstName: string;

  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  lastName: string;

  @Column({
    validate: {
      notEmpty: true,
    },
  })
  phone: string;

  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true,
    },
  })
  email: string;
  
  @Column({
    validate: {
      notEmpty: true,
    },
  })
  address: string;

  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  hashedPassword: string;

  @HasMany(() => Lesson)
  lessons: Lesson[];

  @HasOne(() => Group)
  group: Group;

  @BelongsToMany(() => Subject, () => TeacherSubjectAssignment)
  subjects: Teacher[];
}
