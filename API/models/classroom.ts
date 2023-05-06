import { Table, Column, Model, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Group } from './group';
import { Lesson } from './lesson';

@Table
export class Classroom extends Model {
  @ForeignKey(() => Group)
  @Column({
    allowNull: false,
  })
  ownerGroupId: number;

  @Column({
    allowNull: false,
  })
  floor: number;

  @Column({
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  name: string;

  @HasMany(() => Lesson)
  lessons: Lesson[];

  @BelongsTo(() => Group)
  ownerGroup: Group;
}
