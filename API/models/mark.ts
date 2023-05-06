import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Lesson } from './lesson';
import { Student } from './student';
import { Subject } from './subject';

@Table
export class Mark extends Model {
  @ForeignKey(() => Subject)
  @Column({
    allowNull: false,
  })
  subjectId: number;

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

  @Column({
    allowNull: false,
  })
  value: number;

  @BelongsTo(() => Student)
  student: Student;

  @BelongsTo(() => Lesson)
  lesson: Lesson;
}
