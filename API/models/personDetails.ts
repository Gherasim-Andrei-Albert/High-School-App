import { Table, Column, Model, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from './user';

@Table
export class PersonDetails extends Model {
  @ForeignKey(() => User)
  @Column({
    allowNull: false,
  })
  associatedAccountId: number;

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

  @BelongsTo(() => User)
  associatedAccount: User[];
}
