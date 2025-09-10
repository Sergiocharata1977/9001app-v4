import { NextFunction, Request, Response } from 'express';
import { Logger } from '../../shared/utils/logger.js';
import { ApiResponse, AppError } from '../../types/index.js';
import { PersonnelService } from './personnel.service.js';

export class PersonnelController {
  private personnelService = new PersonnelService();

  getAllPersonnel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const organizationId = req.user!.organization_id;
      const { departamento_id, puesto_id, estado, search } = req.query;
      
      const filters = {
        departamento_id: departamento_id as string,
        puesto_id: puesto_id as string,
        estado: estado as string,
        search: search as string
      };

      const personnel = await this.personnelService.findAll(organizationId, filters);

      const response: ApiResponse = {
        success: true,
        message: 'Personal obtenido exitosamente',
        data: personnel,
        timestamp: new Date().toISOString()
      };

      Logger.info(`Personal obtenido para organización ${organizationId}`, {
        count: personnel.length,
        filters,
        userId: req.user!.id
      });

      return res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getPersonnelById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const organizationId = req.user!.organization_id;
      
      // Solo admins y managers pueden ver salarios
      const includeSalary = req.user!.role === 'admin' || req.user!.role === 'manager';
      
      const personnel = await this.personnelService.findById(id, organizationId, includeSalary);
      
      if (!personnel) {
        throw new AppError('Empleado no encontrado', 404);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Empleado obtenido exitosamente',
        data: personnel,
        timestamp: new Date().toISOString()
      };

      return res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getPersonnelByDepartment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { departamento_id } = req.params;
      const organizationId = req.user!.organization_id;
      
      const personnel = await this.personnelService.findByDepartment(departamento_id, organizationId);

      const response: ApiResponse = {
        success: true,
        message: 'Personal del departamento obtenido exitosamente',
        data: personnel,
        timestamp: new Date().toISOString()
      };

      return res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getPersonnelByPosition = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { puesto_id } = req.params;
      const organizationId = req.user!.organization_id;
      
      const personnel = await this.personnelService.findByPosition(puesto_id, organizationId);

      const response: ApiResponse = {
        success: true,
        message: 'Personal del puesto obtenido exitosamente',
        data: personnel,
        timestamp: new Date().toISOString()
      };

      return res.json(response);
    } catch (error) {
      next(error);
    }
  };

  createPersonnel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const organizationId = req.user!.organization_id;
      const personnelData = {
        ...req.body,
        organization_id: organizationId
      };

      const personnel = await this.personnelService.create(personnelData);

      const response: ApiResponse = {
        success: true,
        message: 'Empleado creado exitosamente',
        data: personnel,
        timestamp: new Date().toISOString()
      };

      Logger.info(`Empleado creado: ${personnel.nombre} ${personnel.apellido || ''}`, {
        personnelId: personnel.id,
        numero_legajo: personnel.numero_legajo,
        departamento_id: personnel.departamento_id,
        puesto_id: personnel.puesto_id,
        organizationId,
        userId: req.user!.id
      });

      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  updatePersonnel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const organizationId = req.user!.organization_id;
      const updates = req.body;

      const personnel = await this.personnelService.update(id, organizationId, updates);

      const response: ApiResponse = {
        success: true,
        message: 'Empleado actualizado exitosamente',
        data: personnel,
        timestamp: new Date().toISOString()
      };

      Logger.info(`Empleado actualizado: ${personnel.nombre} ${personnel.apellido || ''}`, {
        personnelId: id,
        organizationId,
        userId: req.user!.id,
        updates: Object.keys(updates)
      });

      return res.json(response);
    } catch (error) {
      next(error);
    }
  };

  deletePersonnel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const organizationId = req.user!.organization_id;

      await this.personnelService.delete(id, organizationId);

      const response: ApiResponse = {
        success: true,
        message: 'Empleado eliminado exitosamente',
        timestamp: new Date().toISOString()
      };

      Logger.info(`Empleado eliminado`, {
        personnelId: id,
        organizationId,
        userId: req.user!.id
      });

      return res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getPersonnelStats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const organizationId = req.user!.organization_id;
      const stats = await this.personnelService.getStats(organizationId);

      const response: ApiResponse = {
        success: true,
        message: 'Estadísticas de personal obtenidas exitosamente',
        data: stats,
        timestamp: new Date().toISOString()
      };

      return res.json(response);
    } catch (error) {
      next(error);
    }
  };
}