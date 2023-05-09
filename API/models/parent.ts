import { Table, Model, HasMany, BelongsTo, Column, ForeignKey } from 'sequelize-typescript';
import { Student } from './student';
import { User } from './user';
import { Group } from './group';

@Table
export class Parent extends Model {

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
  })
  accountId: number;

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
  address: string;

  @HasMany(() => Student)
  chlidren: Student[];

  @BelongsTo(() => User)
  account: User;
}
