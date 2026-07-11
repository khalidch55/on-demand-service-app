import { ServiceCategory } from '../models/ServiceCategory';
import { Service } from '../models/Service';
import { NotFoundError, BadRequestError } from '../utils/errors';

// Categories
export const createCategory = async (name: string, description?: string) => {
  return ServiceCategory.create({ name, description });
};

export const getAllCategories = async () => {
  return ServiceCategory.findAll();
};

export const getCategoryById = async (id: number) => {
  const cat = await ServiceCategory.findByPk(id);
  if (!cat) throw new NotFoundError('Category not found');
  return cat;
};

export const updateCategory = async (id: number, data: Partial<ServiceCategory>) => {
  const cat = await ServiceCategory.findByPk(id);
  if (!cat) throw new NotFoundError('Category not found');
  return cat.update(data);
};

export const deleteCategory = async (id: number) => {
  const cat = await ServiceCategory.findByPk(id);
  if (!cat) throw new NotFoundError('Category not found');
  await cat.destroy();
};

// Services
export const createService = async (data: { name: string; description?: string; price: number; durationMinutes: number; categoryId: number; isActive?: boolean }) => {
  const cat = await ServiceCategory.findByPk(data.categoryId);
  if (!cat) throw new BadRequestError('Category does not exist');
  return Service.create(data);
};

export const getAllServices = async (activeOnly?: boolean) => {
  const where = activeOnly ? { isActive: true } : {};
  return Service.findAll({ where, include: [ServiceCategory] });
};

export const getServiceById = async (id: number) => {
  const service = await Service.findByPk(id, { include: [ServiceCategory] });
  if (!service) throw new NotFoundError('Service not found');
  return service;
};

export const updateService = async (id: number, data: Partial<Service>) => {
  const service = await Service.findByPk(id);
  if (!service) throw new NotFoundError('Service not found');
  return service.update(data);
};

export const deleteService = async (id: number) => {
  const service = await Service.findByPk(id);
  if (!service) throw new NotFoundError('Service not found');
  await service.destroy();
};