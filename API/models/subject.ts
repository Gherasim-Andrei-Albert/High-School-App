import { Table, Column, Model, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Lesson } from './lesson';
import { Mark } from './mark';
import { Teacher } from './teacher';
import { TeacherSubjectAssignment } from './teachersubjectassignment';

@Table
export class Subject extends Model {
  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  name: string;

  @HasMany(() => Lesson)
  lessons: Lesson[];

  @BelongsToMany(() => Teacher, () => TeacherSubjectAssignment)
  teachers: Teacher[];
}
