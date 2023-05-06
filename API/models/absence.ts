import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Lesson } from './lesson';
import { Student } from './student';

@Table
export class Absence extends Model {
  @ForeignKey(() => Lesson)
  @Column({
    allowNull: false,
  })
  lessonId: number;

  @ForeignKey(() => Student)
  @Column({
    allowNull: false,
  })
  studentId: number;

  @BelongsTo(() => Student)
  student: Student;

  @BelongsTo(() => Lesson)
  lesson: Lesson;
}
