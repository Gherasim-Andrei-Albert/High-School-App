import { Table, Model, HasMany, BelongsToMany, HasOne, BelongsTo, Column, ForeignKey } from 'sequelize-typescript';
import { Lesson } from './lesson';
import { Subject } from './subject';
import { TeacherSubjectAssignment } from './teacherSubjectAssignment';
import { Group } from './group';
import { User } from './user';

@Table
export class Teacher extends Model {

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
  })
  accountId: number;

  @HasMany(() => Lesson)
  lessons: Lesson[];

  @HasOne(() => Group)
  group: Group;

  @BelongsToMany(() => Subject, () => TeacherSubjectAssignment)
  subjects: Teacher[];

  @BelongsTo(() => User)
  account: User;
}
