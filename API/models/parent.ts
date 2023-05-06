import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { Student } from './student';

@Table
export class Parent extends Model {
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
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true,
    },
  })
  email: string;
  
  @Column({
    validate: {
      notEmpty: true,
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

  @HasMany(() => Student)
  chlidren: Student[];
}
