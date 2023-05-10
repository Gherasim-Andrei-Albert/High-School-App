import { Table, Model, HasMany, BelongsToMany, HasOne, BelongsTo, Column, ForeignKey } from 'sequelize-typescript';
import { Lesson } from './lesson';
import { Subject } from './subject';
import { TeacherSubjectAssignment } from './teachersubjectassignment';
import { Group } from './group';
import { User } from './user';

@Table
export class Teacher extends Model {

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
  })
  accountId: number;

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
    validate: {
      notEmpty: true,
    },
  })
  address: string;

  @HasMany(() => Lesson)
  lessons: Lesson[];

  @HasOne(() => Group)
  group: Group;

  @BelongsToMany(() => Subject, () => TeacherSubjectAssignment)
  subjects: Teacher[];

  @BelongsTo(() => User)
  account: User;
}
