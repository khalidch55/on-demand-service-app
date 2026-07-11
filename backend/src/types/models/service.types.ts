import { Optional } from 'sequelize';

export interface IServiceAttributes {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  durationMinutes: number;
  isActive: boolean;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type IServiceCreationAttributes = Optional<
  IServiceAttributes,
  'id' | 'description' | 'isActive' | 'createdAt' | 'updatedAt'
>;
