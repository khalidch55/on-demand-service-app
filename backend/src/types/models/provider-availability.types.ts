import { Optional } from 'sequelize';

export interface IProviderAvailabilityAttributes {
  id: number;
  providerId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IProviderAvailabilityCreationAttributes = Optional<
  IProviderAvailabilityAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;
