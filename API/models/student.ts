import { Table, Column, Model, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { Group } from './group';
import { Parent } from './parent';
import { Absence } from './absence';
import { Mark } from './mark';
import { User } from './user';

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

  @HasMany(() => Mark)
  marks: Mark[];

  @HasMany(() => Absence)
  abssences: Absence[];

  @BelongsTo(() => Parent)
  parent: Parent;

  @BelongsTo(() => Group)
  group: Group;

  @BelongsTo(() => User)
  account: User[];
}
