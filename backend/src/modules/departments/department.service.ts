import { AppError } from '../../types/index.js';
import Department, { IDepartment } from './department.model.js';

export class DepartmentService {
  
  async findAll(organizationId: string): Promise<IDepartment[]> {
    try {
      return await Department
        .find({ organizationId, isActive: true })
        .populate('manager', 'name email')
        .sort({ name: 1 });
    } catch (error) {
      throw new AppError('Error obteniendo departamentos', 500);
    }
  }

  async findById(id: string, organizationId: string): Promise<IDepartment | null> {
    try {
      return await Department
        .findOne({ _id: id, organizationId, isActive: true })
        .populate('manager', 'name email')
        .populate('personnel', 'name email position');
    } catch (error) {
      throw new AppError('Error obteniendo departamento', 500);
    }
  }

  async findByCode(code: string, organizationId: string): Promise<IDepartment | null> {
    try {
      return await Department.findOne({ 
        code: code.toUpperCase(), 
        organizationId, 
        isActive: true 
      });
    } catch (error) {
      throw new AppError('Error buscando departamento por código', 500);
    }
  }

  async create(departmentData: {
    name: string;
    description?: string;
    code: string;
    managerId?: string;
    organizationId: string;
  }): Promise<IDepartment> {
    try {
      // Verificar si el código ya existe
      const existingDept = await this.findByCode(departmentData.code, departmentData.organizationId);
      if (existingDept) {
        throw new AppError('Ya existe un departamento con ese código', 409);
      }

      const department = new Department({
        ...departmentData,
        code: departmentData.code.toUpperCase()
      });

      return await department.save();
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error.code === 11000) {
        throw new AppError('Ya existe un departamento con ese código', 409);
      }
      throw new AppError('Error creando departamento', 500);
    }
  }

  async update(
    id: string, 
    organizationId: string,
    updates: Partial<Pick<IDepartment, 'name' | 'description' | 'code' | 'managerId'>>
  ): Promise<IDepartment> {
    try {
      // Si se actualiza el código, verificar que no exista
      if (updates.code) {
        const existingDept = await Department.findOne({
          code: updates.code.toUpperCase(),
          organizationId,
          _id: { $ne: id },
          isActive: true
        });
        
        if (existingDept) {
          throw new AppError('Ya existe un departamento con ese código', 409);
        }
        
        updates.code = updates.code.toUpperCase();
      }

      const department = await Department.findOneAndUpdate(
        { _id: id, organizationId, isActive: true },
        { $set: { ...updates, updatedAt: new Date() } },
        { new: true, runValidators: true }
      ).populate('manager', 'name email');

      if (!department) {
        throw new AppError('Departamento no encontrado', 404);
      }

      return department;
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error.code === 11000) {
        throw new AppError('Ya existe un departamento con ese código', 409);
      }
      throw new AppError('Error actualizando departamento', 500);
    }
  }

  async delete(id: string, organizationId: string): Promise<void> {
    try {
      // Soft delete
      const department = await Department.findOneAndUpdate(
        { _id: id, organizationId, isActive: true },
        { $set: { isActive: false, updatedAt: new Date() } },
        { new: true }
      );

      if (!department) {
        throw new AppError('Departamento no encontrado', 404);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error eliminando departamento', 500);
    }
  }

  async getStats(organizationId: string): Promise<{
    total: number;
    withManager: number;
    withoutManager: number;
    totalPersonnel: number;
  }> {
    try {
      const stats = await Department.aggregate([
        { $match: { organizationId, isActive: true } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            withManager: {
              $sum: {
                $cond: [{ $ne: ['$managerId', null] }, 1, 0]
              }
            }
          }
        }
      ]);

      const result = stats[0] || { total: 0, withManager: 0 };
      
      return {
        total: result.total,
        withManager: result.withManager,
        withoutManager: result.total - result.withManager,
        totalPersonnel: 0 // TODO: Implementar cuando tengamos el módulo de personal
      };
    } catch (error) {
      throw new AppError('Error obteniendo estadísticas de departamentos', 500);
    }
  }
}