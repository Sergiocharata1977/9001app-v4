import { AppError } from '../../types/index.js';
import Personnel, { IPersonnel } from './personnel.model.js';

export class PersonnelService {
  /**
   * Obtener todo el personal de una organización
   */
  async findAll(organizationId: string, filters: any = {}): Promise<IPersonnel[]> {
    try {
      const query: any = { 
        organization_id: organizationId,
        is_active: true 
      };

      // Aplicar filtros
      if (filters.departamento_id) {
        query.departamento_id = filters.departamento_id;
      }
      if (filters.puesto_id) {
        query.puesto_id = filters.puesto_id;
      }
      if (filters.estado) {
        query.estado = filters.estado;
      }
      if (filters.search) {
        query.$or = [
          { nombre: { $regex: filters.search, $options: 'i' } },
          { apellido: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } },
          { documento_identidad: { $regex: filters.search, $options: 'i' } }
        ];
      }

      const personnel = await Personnel.find(query)
        .populate('departamento_relacion', 'nombre descripcion')
        .populate('puesto_relacion', 'nombre descripcion')
        .sort({ nombre: 1, apellido: 1 });

      return personnel;
    } catch (error) {
      throw new AppError('Error al obtener personal', 500);
    }
  }

  /**
   * Obtener personal por ID
   */
  async findById(id: string, organizationId: string, includeSalary: boolean = false): Promise<IPersonnel | null> {
    try {
      const personnel = await Personnel.findOne({
        _id: id,
        organization_id: organizationId,
        is_active: true
      })
      .populate('departamento_relacion', 'nombre descripcion')
      .populate('puesto_relacion', 'nombre descripcion');

      if (personnel && includeSalary) {
        personnel.$locals.includeSalary = true;
      }

      return personnel;
    } catch (error) {
      throw new AppError('Error al obtener personal', 500);
    }
  }

  /**
   * Obtener personal por departamento
   */
  async findByDepartment(departamentoId: string, organizationId: string): Promise<IPersonnel[]> {
    try {
      const personnel = await Personnel.find({
        departamento_id: departamentoId,
        organization_id: organizationId,
        is_active: true
      })
      .populate('departamento_relacion', 'nombre descripcion')
      .populate('puesto_relacion', 'nombre descripcion')
      .sort({ nombre: 1, apellido: 1 });

      return personnel;
    } catch (error) {
      throw new AppError('Error al obtener personal del departamento', 500);
    }
  }

  /**
   * Obtener personal por puesto
   */
  async findByPosition(puestoId: string, organizationId: string): Promise<IPersonnel[]> {
    try {
      const personnel = await Personnel.find({
        puesto_id: puestoId,
        organization_id: organizationId,
        is_active: true
      })
      .populate('departamento_relacion', 'nombre descripcion')
      .populate('puesto_relacion', 'nombre descripcion')
      .sort({ nombre: 1, apellido: 1 });

      return personnel;
    } catch (error) {
      throw new AppError('Error al obtener personal del puesto', 500);
    }
  }

  /**
   * Crear nuevo personal
   */
  async create(personnelData: any): Promise<IPersonnel> {
    try {
      // Verificar que el departamento existe si se proporciona
      if (personnelData.departamento_id) {
        const Department = (await import('../departments/department.model.js')).default;
        const department = await Department.findOne({
          _id: personnelData.departamento_id,
          organization_id: personnelData.organization_id,
          is_active: true
        });

        if (!department) {
          throw new AppError('El departamento especificado no existe', 400);
        }
      }

      // Verificar que el puesto existe si se proporciona
      if (personnelData.puesto_id) {
        const Position = (await import('../positions/position.model.js')).default;
        const position = await Position.findOne({
          _id: personnelData.puesto_id,
          organization_id: personnelData.organization_id,
          is_active: true
        });

        if (!position) {
          throw new AppError('El puesto especificado no existe', 400);
        }
      }

      // Generar número de legajo automático si no se proporciona
      if (!personnelData.numero_legajo) {
        const count = await Personnel.countDocuments({ 
          organization_id: personnelData.organization_id 
        });
        personnelData.numero_legajo = `LEG${String(count + 1).padStart(4, '0')}`;
      }

      const personnel = new Personnel(personnelData);
      await personnel.save();

      return personnel;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error al crear personal', 500);
    }
  }

  /**
   * Actualizar personal
   */
  async update(id: string, organizationId: string, updates: any): Promise<IPersonnel> {
    try {
      // Verificar que el personal existe
      const existingPersonnel = await Personnel.findOne({
        _id: id,
        organization_id: organizationId,
        is_active: true
      });

      if (!existingPersonnel) {
        throw new AppError('Personal no encontrado', 404);
      }

      // Verificar que el departamento existe si se actualiza
      if (updates.departamento_id) {
        const Department = (await import('../departments/department.model.js')).default;
        const department = await Department.findOne({
          _id: updates.departamento_id,
          organization_id: organizationId,
          is_active: true
        });

        if (!department) {
          throw new AppError('El departamento especificado no existe', 400);
        }
      }

      // Verificar que el puesto existe si se actualiza
      if (updates.puesto_id) {
        const Position = (await import('../positions/position.model.js')).default;
        const position = await Position.findOne({
          _id: updates.puesto_id,
          organization_id: organizationId,
          is_active: true
        });

        if (!position) {
          throw new AppError('El puesto especificado no existe', 400);
        }
      }

      const personnel = await Personnel.findOneAndUpdate(
        { _id: id, organization_id: organizationId },
        { ...updates, updated_at: new Date() },
        { new: true, runValidators: true }
      )
      .populate('departamento_relacion', 'nombre descripcion')
      .populate('puesto_relacion', 'nombre descripcion');

      if (!personnel) {
        throw new AppError('Personal no encontrado', 404);
      }

      return personnel;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error al actualizar personal', 500);
    }
  }

  /**
   * Eliminar personal (soft delete)
   */
  async delete(id: string, organizationId: string): Promise<void> {
    try {
      const personnel = await Personnel.findOne({
        _id: id,
        organization_id: organizationId,
        is_active: true
      });

      if (!personnel) {
        throw new AppError('Personal no encontrado', 404);
      }

      // Soft delete
      await Personnel.findOneAndUpdate(
        { _id: id, organization_id: organizationId },
        { is_active: false, updated_at: new Date() }
      );
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error al eliminar personal', 500);
    }
  }

  /**
   * Obtener estadísticas de personal
   */
  async getStats(organizationId: string): Promise<any> {
    try {
      const totalPersonnel = await Personnel.countDocuments({
        organization_id: organizationId,
        is_active: true
      });

      const personnelByDepartment = await Personnel.aggregate([
        {
          $match: {
            organization_id: organizationId,
            is_active: true
          }
        },
        {
          $lookup: {
            from: 'departments',
            localField: 'departamento_id',
            foreignField: '_id',
            as: 'departamento'
          }
        },
        {
          $unwind: { path: '$departamento', preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: '$departamento.nombre',
            count: { $sum: 1 }
          }
        }
      ]);

      const personnelByPosition = await Personnel.aggregate([
        {
          $match: {
            organization_id: organizationId,
            is_active: true
          }
        },
        {
          $lookup: {
            from: 'positions',
            localField: 'puesto_id',
            foreignField: '_id',
            as: 'puesto'
          }
        },
        {
          $unwind: { path: '$puesto', preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: '$puesto.nombre',
            count: { $sum: 1 }
          }
        }
      ]);

      const personnelByStatus = await Personnel.aggregate([
        {
          $match: {
            organization_id: organizationId,
            is_active: true
          }
        },
        {
          $group: {
            _id: '$estado',
            count: { $sum: 1 }
          }
        }
      ]);

      return {
        total_personal: totalPersonnel,
        by_department: personnelByDepartment,
        by_position: personnelByPosition,
        by_status: personnelByStatus
      };
    } catch (error) {
      throw new AppError('Error al obtener estadísticas', 500);
    }
  }
}