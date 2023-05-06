import { Table, Column, Model, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { Subject } from './subject';
import { Teacher } from './teacher';
import { Group } from './group';
import { Classroom } from './classroom';
import { DataTypes } from 'sequelize';
import { Mark } from './mark';
import { Absence } from './absence';

@Table
export class Lesson extends Model {
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

  @ForeignKey(() => Group)
  @Column({
    allowNull: false,
  })
  groupId: number;

  @ForeignKey(() => Classroom)
  @Column({
    allowNull: false,
  })
  classroomId: number;

  @Column({
    allowNull: false,
  })
  academicYear: number;

  @Column({
    allowNull: false,
  })
  weekday: number;

  @Column({
    allowNull: false,
    type: DataTypes.TIME,
  })
  startTime: Date;

  @Column({
    allowNull: false,
    type: DataTypes.TIME,
  })
  endTime: Date;

  @HasMany(() => Mark)
  marks: Mark[];

  @HasMany(() => Absence)
  abbsences: Mark[];

  @BelongsTo(() => Subject)
  subject: Subject;

  @BelongsTo(() => Teacher)
  teacher: Teacher;

  @BelongsTo(() => Group)
  group: Group;

  @BelongsTo(() => Classroom)
  classRoom: Classroom;
}
