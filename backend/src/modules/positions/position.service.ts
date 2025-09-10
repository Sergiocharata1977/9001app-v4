import { AppError } from '../../types/index.js';
import Position, { IPosition } from './position.model.js';

export class PositionService {
  /**
   * Obtener todos los puestos de una organización
   */
  async findAll(organizationId: string, departamentoId?: string): Promise<IPosition[]> {
    try {
      const filter: any = { 
        organization_id: organizationId,
        is_active: true 
      };

      if (departamentoId) {
        filter.departamento_id = departamentoId;
      }

      const positions = await Position.find(filter)
        .populate('departamento', 'nombre descripcion')
        .sort({ nombre: 1 });

      return positions;
    } catch (error) {
      throw new AppError('Error al obtener puestos', 500);
    }
  }

  /**
   * Obtener puesto por ID
   */
  async findById(id: string, organizationId: string): Promise<IPosition | null> {
    try {
      const position = await Position.findOne({
        _id: id,
        organization_id: organizationId,
        is_active: true
      })
      .populate('departamento', 'nombre descripcion')
      .populate('personal', 'nombre apellido email');

      return position;
    } catch (error) {
      throw new AppError('Error al obtener puesto', 500);
    }
  }

  /**
   * Obtener puestos por departamento
   */
  async findByDepartment(departamentoId: string, organizationId: string): Promise<IPosition[]> {
    try {
      const positions = await Position.find({
        departamento_id: departamentoId,
        organization_id: organizationId,
        is_active: true
      })
      .populate('departamento', 'nombre descripcion')
      .sort({ nombre: 1 });

      return positions;
    } catch (error) {
      throw new AppError('Error al obtener puestos del departamento', 500);
    }
  }

  /**
   * Crear nuevo puesto
   */
  async create(positionData: any): Promise<IPosition> {
    try {
      // Verificar que el departamento existe si se proporciona
      if (positionData.departamento_id) {
        const Department = (await import('../departments/department.model.js')).default;
        const department = await Department.findOne({
          _id: positionData.departamento_id,
          organization_id: positionData.organization_id,
          is_active: true
        });

        if (!department) {
          throw new AppError('El departamento especificado no existe', 400);
        }
      }

      const position = new Position(positionData);
      await position.save();

      return position;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error al crear puesto', 500);
    }
  }

  /**
   * Actualizar puesto
   */
  async update(id: string, organizationId: string, updates: any): Promise<IPosition> {
    try {
      // Verificar que el puesto existe
      const existingPosition = await Position.findOne({
        _id: id,
        organization_id: organizationId,
        is_active: true
      });

      if (!existingPosition) {
        throw new AppError('Puesto no encontrado', 404);
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

      const position = await Position.findOneAndUpdate(
        { _id: id, organization_id: organizationId },
        { ...updates, updated_at: new Date() },
        { new: true, runValidators: true }
      )
      .populate('departamento', 'nombre descripcion');

      if (!position) {
        throw new AppError('Puesto no encontrado', 404);
      }

      return position;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error al actualizar puesto', 500);
    }
  }

  /**
   * Eliminar puesto (soft delete)
   */
  async delete(id: string, organizationId: string): Promise<void> {
    try {
      const position = await Position.findOne({
        _id: id,
        organization_id: organizationId,
        is_active: true
      });

      if (!position) {
        throw new AppError('Puesto no encontrado', 404);
      }

      // Verificar si tiene personal asignado
      const Personnel = (await import('../personnel/personnel.model.js')).default;
      const personnelCount = await Personnel.countDocuments({
        puesto_id: id,
        organization_id: organizationId,
        is_active: true
      });

      if (personnelCount > 0) {
        throw new AppError('No se puede eliminar un puesto que tiene personal asignado', 400);
      }

      // Soft delete
      await Position.findOneAndUpdate(
        { _id: id, organization_id: organizationId },
        { is_active: false, updated_at: new Date() }
      );
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error al eliminar puesto', 500);
    }
  }

  /**
   * Obtener estadísticas de puestos
   */
  async getStats(organizationId: string): Promise<any> {
    try {
      const totalPositions = await Position.countDocuments({
        organization_id: organizationId,
        is_active: true
      });

      const positionsWithPersonnel = await Position.aggregate([
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
            foreignField: 'puesto_id',
            as: 'personal'
          }
        },
        {
          $project: {
            nombre: 1,
            departamento_id: 1,
            personal_count: { $size: '$personal' }
          }
        }
      ]);

      const totalPersonnel = positionsWithPersonnel.reduce(
        (sum, pos) => sum + pos.personal_count, 0
      );

      // Estadísticas por departamento
      const statsByDepartment = await Position.aggregate([
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
            puestos_count: { $sum: 1 }
          }
        }
      ]);

      return {
        total_puestos: totalPositions,
        total_personal: totalPersonnel,
        puestos_with_personnel: positionsWithPersonnel.filter(
          pos => pos.personal_count > 0
        ).length,
        puestos_without_personnel: positionsWithPersonnel.filter(
          pos => pos.personal_count === 0
        ).length,
        stats_by_department: statsByDepartment,
        puestos_detail: positionsWithPersonnel
      };
    } catch (error) {
      throw new AppError('Error al obtener estadísticas', 500);
    }
  }
}