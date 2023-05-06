import { Table, Column, Model, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { Group } from './group';
import { Parent } from './parent';
import { Absence } from './absence';
import { Mark } from './mark';

@Table
export class Student extends Model {
  @ForeignKey(() => Group)
  @Column({
    allowNull: false,
  })
  groupId: number;

  @ForeignKey(() => Parent)
  @Column({
    allowNull: false,
  })
  parentId: number;

  @Column({
    allowNull: false,
  })
  enrolmentYear: number;

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
  email: string;

  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true,
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

  @HasMany(() => Mark)
  marks: Mark[];

  @HasMany(() => Absence)
  abssences: Absence[];

  @BelongsTo(() => Parent)
  parent: Parent;

  @BelongsTo(() => Group)
  group: Group;
}
