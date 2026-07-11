import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import {
  IServiceCategoryAttributes,
  IServiceCategoryCreationAttributes,
} from '../types/models/service-category.types';
import { Service } from './Service';

@Table({ tableName: 'service_categories', timestamps: true })
export class ServiceCategory extends Model<IServiceCategoryAttributes, IServiceCategoryCreationAttributes>
  implements IServiceCategoryAttributes
{
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description?: string | null;

  declare createdAt: Date;
  declare updatedAt: Date;

  @HasMany(() => Service)
  services?: Service[];
}
