import { Request, Response, NextFunction } from 'express';
import { DepartmentService } from './department.service.js';
import { AppError, ApiResponse } from '../../types/index.js';
import { Logger } from '../../shared/utils/logger.js';

export class DepartmentController {
  private departmentService = new DepartmentService();

  getAllDepartments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const organizationId = req.user!.organizationId;
      const departments = await this.departmentService.findAll(organizationId);

      const response: ApiResponse = {
        success: true,
        message: 'Departamentos obtenidos exitosamente',
        data: departments,
        timestamp: new Date().toISOString()
      };

      Logger.info(`Departamentos obtenidos para organización ${organizationId}`, {
        count: departments.length,
        userId: req.user!.id
      });

      return res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getDepartmentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const organizationId = req.user!.organizationId;
      
      const department = await this.departmentService.findById(id, organizationId);
      
      if (!department) {
        throw new AppError('Departamento no encontrado', 404);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Departamento obtenido exitosamente',
        data: department,
        timestamp: new Date().toISOString()
      };

      return res.json(response);
    } catch (error) {
      next(error);
    }
  };

  createDepartment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const organizationId = req.user!.organizationId;
      const departmentData = {
        ...req.body,
        organizationId
      };

      ent.id,
 : departmmentId depart{
       t.name}`, epartmencreado: ${dnto `DepartameLogger.info(     ;

 
      }tring()ate().toISOS: new D timestampnt,
       epartmeata: d       d
 nte',tosameexireado artamento cDepge: ' messa       ess: true,
        succsponse = {
onse: ApiRenst resp

      cotData);enpartmcreate(dentService.methis.depart= await nt st departme con   