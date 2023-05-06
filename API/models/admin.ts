import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Admin extends Model {
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
}
