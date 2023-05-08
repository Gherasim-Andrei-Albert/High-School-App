import { Table, Model, HasMany, BelongsTo } from 'sequelize-typescript';
import { Student } from './student';
import { User } from './user';

@Table
export class Parent extends Model {

  @HasMany(() => Student)
  chlidren: Student[];

  @BelongsTo(() => User)
  account: User[];
}
