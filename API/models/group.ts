import { Table, Column, Model, ForeignKey, HasMany, HasOne, BelongsTo } from 'sequelize-typescript';
import { Teacher } from './teacher';
import { Student } from './student';
import { Classroom } from './classroom';

@Table
export class Group extends Model {
  @ForeignKey(() => Teacher)
  @Column({
    allowNull: false,
  })
  masterTeacherId: number;

  @Column({
    allowNull: false,
  })
  academicYear: number;

  @Column({
    allowNull: false,
  })
  grade: number;

  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  name: string;

  @HasMany(() => Student)
  students: Student[];

  @HasOne(() => Classroom)
  group: Classroom;

  @BelongsTo(() => Teacher)
  masterTeacher: Teacher;
}
