import { ProviderAvailability } from '../models/ProviderAvailability';
import { NotFoundError } from '../utils/errors';

export const addAvailability = async (providerId: number, dayOfWeek: number, startTime: string, endTime: string) => {
  return ProviderAvailability.create({ providerId, dayOfWeek, startTime, endTime });
};

export const getMyAvailability = async (providerId: number) => {
  return ProviderAvailability.findAll({ where: { providerId } });
};

export const updateAvailability = async (id: number, providerId: number, data: Partial<ProviderAvailability>) => {
  const slot = await ProviderAvailability.findOne({ where: { id, providerId } });
  if (!slot) throw new NotFoundError('Availability slot not found');
  return slot.update(data);
};

export const deleteAvailability = async (id: number, providerId: number) => {
  const slot = await ProviderAvailability.findOne({ where: { id, providerId } });
  if (!slot) throw new NotFoundError('Availability slot not found');
  await slot.destroy();
};