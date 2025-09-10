import { AppError } from '../../types/index.js';
import Department, { IDepartment } from './department.model.js';

export class DepartmentService {
  /**
   * Obtener todos los departamentos de una organización
   */
  async findAll(organizationId: string): Promise<IDepartment[]> {
    try {
      const departments = await Department.find({ 
        organization_id: organizationId,
        is_active: true 
      })
      .populate('responsable', 'nombre apellido email')
      .sort({ nombre: 1 });

      return departments;
    } catch (error) {
      throw new AppError('Error al obtener departamentos', 500);
    }
  }

  /**
   * Obtener departamento por ID
   */
  async findById(id: string, organizationId: string): Promise<IDepartment | null> {
    try {
      const department = await Department.findOne({
        _id: id,
        organization_id: organizationId,
        is_active: true
      })
      .populate('responsable', 'nombre apellido email')
      .populate('personal', 'nombre apellido email puesto');

      return department;
    } catch (error) {
      throw new AppError('Error al obtener departamento', 500);
    }
  }

  /**
   * Crear nuevo departamento
   */
  async create(departmentData: any): Promise<IDepartment> {
    try {
      // Verificar que el código no exista en la organización
      const existingDepartment = await Department.findOne({
        organization_id: departmentData.organization_id,
        codigo: departmentData.codigo?.toUpperCase(),
        is_active: true
      });

      if (existingDepartment) {
        throw new AppError('El código de departamento ya existe', 400);
      }

      // Generar código automático si no se proporciona
      if (!departmentData.codigo) {
        const count = await Department.countDocuments({ 
          organization_id: departmentData.organization_id 
        });
        departmentData.codigo = `DEPT${String(count + 1).padStart(3, '0')}`;
      } else {
        departmentData.codigo = departmentData.codigo.toUpperCase();
      }

      const department = new Department(departmentData);
      await department.save();

      return department;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error al crear departamento', 500);
    }
  }

  /**
   * Actualizar departamento
   */
  async update(id: string, organizationId: string, updates: any): Promise<IDepartment> {
    try {
      // Verificar que el departamento existe
      const existingDepartment = await Department.findOne({
        _id: id,
        organization_id: organizationId,
        is_active: true
      });

      if (!existingDepartment) {
        throw new AppError('Departamento no encontrado', 404);
      }

      // Si se actualiza el código, verificar que no exista
      if (updates.codigo && updates.codigo !== existingDepartment.codigo) {
        const codeExists = await Department.findOne({
          organization_id: organizationId,
          codigo: updates.codigo.toUpperCase(),
          is_active: true,
          _id: { $ne: id }
        });

        if (codeExists) {
          throw new AppError('El código de departamento ya existe', 400);
        }

        updates.codigo = updates.codigo.toUpperCase();
      }

      const department = await Department.findOneAndUpdate(
        { _id: id, organization_id: organizationId },
        { ...updates, updated_at: new Date() },
        { new: true, runValidators: true }
      )
      .populate('responsable', 'nombre apellido email');

      if (!department) {
        throw new AppError('Departamento no encontrado', 404);
      }

      return department;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error al actualizar departamento', 500);
    }
  }

  /**
   * Eliminar departamento (soft delete)
   */
  async delete(id: string, organizationId: string): Promise<void> {
    try {
      const department = await Department.findOne({
        _id: id,
        organization_id: organizationId,
        is_active: true
      });

      if (!department) {
        throw new AppError('Departamento no encontrado', 404);
      }

      // Verificar si tiene personal asignado
      const personnelCount = await Department.findById(id)
        .populate('personal')
        .then(dept => dept?.personal?.length || 0);

      if (personnelCount > 0) {
        throw new AppError('No se puede eliminar un departamento que tiene personal asignado', 400);
      }

      // Soft delete
      await Department.findOneAndUpdate(
        { _id: id, organization_id: organizationId },
        { is_active: false, updated_at: new Date() }
      );
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error al eliminar departamento', 500);
    }
  }

  /**
   * Obtener estadísticas de departamentos
   */
  async getStats(organizationId: string): Promise<any> {
    try {
      const totalDepartments = await Department.countDocuments({
        organization_id: organizationId,
        is_active: true
      });

      const departmentsWithPersonnel = await Department.aggregate([
        {
          $match: {
            organization_id: organizationId,
            is_active: true
          }
        },
        {
          $lookup: {
            from: 'personnel',
            localField: '_id',
            foreignField: 'departamento_id',
            as: 'personal'
          }
        },
        {
          $project: {
            nombre: 1,
            personal_count: { $size: '$personal' }
          }
        }
      ]);

      const totalPersonnel = departmentsWithPersonnel.reduce(
        (sum, dept) => sum + dept.personal_count, 0
      );

      return {
        total_departments: totalDepartments,
        total_personnel: totalPersonnel,
        departments_with_personnel: departmentsWithPersonnel.filter(
          dept => dept.personal_count > 0
        ).length,
        departments_without_personnel: departmentsWithPersonnel.filter(
          dept => dept.personal_count === 0
        ).length,
        departments_detail: departmentsWithPersonnel
      };
    } catch (error) {
      throw new AppError('Error al obtener estadísticas', 500);
    }
  }
}