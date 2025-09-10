import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';
import { AppError, User, UserRole } from '../types/index.js';

export class UserService {
  private db = getDatabase();
  private collection = this.db.collection('users');

  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.collection.findOne({ 
        _id: new ObjectId(id),
        isActive: true 
      });
      
      if (!user) return null;
      
      return this.mapToUser(user);
    } catch (error) {
      throw new AppError('Error buscando usuario', 500);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.collection.findOne({ 
        email: email.toLowerCase(),
        isActive: true 
      });
      
      if (!user) return null;
      
      return this.mapToUser(user);
    } catch (error) {
      throw new AppError('Error buscando usuario por email', 500);
    }
  }

  async create(userData: {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
    organizationId: string;
  }): Promise<User> {
    try {
      // Verificar si el email ya existe
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new AppError('El email ya está registrado', 409);
      }

      // Hash de la contraseña
      const passwordHash = await bcrypt.hash(userData.password, 12);

      const newUser = {
        email: userData.email.toLowerCase(),
        name: userData.name,
        passwordHash,
        role: userData.role || UserRole.USER,
        organizationId: userData.organizationId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await this.collection.insertOne(newUser);
      
      return this.mapToUser({
        _id: result.insertedId,
        ...newUser
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error creando usuario', 500);
    }
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, user.passwordHash);
    } catch (error) {
      throw new AppError('Error validando contraseña', 500);
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.collection.updateOne(
        { _id: new ObjectId(userId) },
        { 
          $set: { 
            lastLogin: new Date(),
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      // No lanzar error, es solo informativo
      console.warn('No se pudo actualizar último login:', error);
    }
  }

  async findByOrganization(organizationId: string): Promise<User[]> {
    try {
      const users = await this.collection
        .find({ 
          organizationId,
          isActive: true 
        })
        .sort({ name: 1 })
        .toArray();
      
      return users.map(user => this.mapToUser(user));
    } catch (error) {
      throw new AppError('Error obteniendo usuarios de la organización', 500);
    }
  }

  async updateUser(
    userId: string, 
    updates: Partial<Pick<User, 'name' | 'email' | 'role' | 'isActive'>>
  ): Promise<User> {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };

      if (updates.email) {
        updateData.email = updates.email.toLowerCase();
      }

      const result = await this.collection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result.value) {
        throw new AppError('Usuario no encontrado', 404);
      }

      return this.mapToUser(result.value);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error actualizando usuario', 500);
    }
  }

  private mapToUser(doc: any): User {
    return {
      id: doc._id.toString(),
      email: doc.email,
      name: doc.name,
      passwordHash: doc.passwordHash,
      role: doc.role,
      organizationId: doc.organizationId,
      isActive: doc.isActive,
      lastLogin: doc.lastLogin,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}