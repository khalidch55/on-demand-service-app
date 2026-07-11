import { Optional } from 'sequelize';

export interface IServiceCategoryAttributes {
  id: number;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type IServiceCategoryCreationAttributes = Optional<
  IServiceCategoryAttributes,
  'id' | 'description' | 'createdAt' | 'updatedAt'
>;
