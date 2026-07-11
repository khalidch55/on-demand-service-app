import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import * as serviceService from '../services/service.service';

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const cat = await serviceService.createCategory(req.body.name, req.body.description);
  sendSuccess(res, cat, 201);
});

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const cats = await serviceService.getAllCategories();
  sendSuccess(res, cats);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as  string, 10);
  const cat = await serviceService.updateCategory(id, req.body);
  sendSuccess(res, cat);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  await serviceService.deleteCategory(id);
  sendSuccess(res, null, 204);
});

export const createService = asyncHandler(async (req: Request, res: Response) => {
  const svc = await serviceService.createService(req.body);
  sendSuccess(res, svc, 201);
});

export const getServices = asyncHandler(async (req: Request, res: Response) => {
  const activeOnly = req.query.activeOnly === 'true';
  const services = await serviceService.getAllServices(activeOnly);
  sendSuccess(res, services);
});

export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const svc = await serviceService.getServiceById(id);
  sendSuccess(res, svc);
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const svc = await serviceService.updateService(id, req.body);
  sendSuccess(res, svc);
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  await serviceService.deleteService(id);
  sendSuccess(res, null, 204);
});