import { Table, Column, Model, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Group } from './group';
import { User } from './user';

@Table
export class Admin extends Model {

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
  })
  accountId: number;

  @Column({
    allowNull: false,
    defaultValue: 'test',
    validate: {
      notEmpty: true,
      isEmail: true,
    },
  })
  email: string;

  @Column({
    allowNull: false,
    defaultValue: 'test',
    validate: {
      notEmpty: true,
    },
  })
  hashedPassword: string;

  @BelongsTo(() => User)
  account: User[];
}
