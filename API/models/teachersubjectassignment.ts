import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { Subject } from './subject';
import { Teacher } from './teacher';

@Table
export class TeacherSubjectAssignment extends Model {
  @ForeignKey(() => Subject)
  @Column({
    allowNull: false,
  })
  subjectId: number;

  @ForeignKey(() => Teacher)
  @Column({
    allowNull: false,
  })
  teacherId: number;
}
