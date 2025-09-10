import { Request, Response } from 'express';
import { AuthService } from '../../services/auth.service.js';
import { Organization } from '../organizations/organization.model.js';
import { User } from '../users/user.model.js';

// Interface para login
interface LoginRequest {
  email: string;
  password: string;
}

// Interface para register
interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  organization_id?: string;
  organization_name?: string;
  organization_code?: string;
}

// Interface para refresh token
interface RefreshTokenRequest {
  refreshToken: string;
}

export class AuthController {
  // Login de usuario
  static async login(req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validar datos de entrada
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
        return;
      }

      // Buscar usuario por email
      const user = await User.findOne({ 
        email: email.toLowerCase(),
        activo: true 
      }).populate('organization_id', 'nombre codigo activo');

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
        return;
      }

      // Verificar que la organización esté activa
      if (!user.organization_id || !(user.organization_id as any).activo) {
        res.status(401).json({
          success: false,
          message: 'Organización inactiva'
        });
        return;
      }

      // Verificar contraseña
      const isPasswordValid = await AuthService.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
        return;
      }

      // Generar tokens
      const { accessToken, refreshToken } = AuthService.generateTokensForUser(user);

      // Actualizar último acceso
      user.ultimo_acceso = new Date();
      await user.save();

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          user: user.toPublicJSON(),
          tokens: {
            accessToken,
            refreshToken
          }
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Registro de usuario
  static async register(req: Request<{}, {}, RegisterRequest>, res: Response): Promise<void> {
    try {
      const { 
        nombre, 
        apellido, 
        email, 
        password, 
        telefono,
        organization_id,
        organization_name,
        organization_code
      } = req.body;

      // Validar datos de entrada
      if (!nombre || !apellido || !email || !password) {
        res.status(400).json({
          success: false,
          message: 'Nombre, apellido, email y contraseña son requeridos'
        });
        return;
      }

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'El usuario ya existe'
        });
        return;
      }

      let organization;

      // Si se proporciona organization_id, verificar que existe
      if (organization_id) {
        organization = await Organization.findById(organization_id);
        if (!organization || !organization.activo) {
          res.status(400).json({
            success: false,
            message: 'Organización no válida'
          });
          return;
        }
      } else if (organization_name && organization_code) {
        // Crear nueva organización
        const existingOrg = await Organization.findOne({ codigo: organization_code.toUpperCase() });
        if (existingOrg) {
          res.status(409).json({
            success: false,
            message: 'El código de organización ya existe'
          });
          return;
        }

        organization = new Organization({
          nombre: organization_name,
          codigo: organization_code.toUpperCase(),
          created_by: null // Se asignará después de crear el usuario
        });
        await organization.save();
      } else {
        res.status(400).json({
          success: false,
          message: 'Se requiere organization_id o datos de nueva organización'
        });
        return;
      }

      // Hash de la contraseña
      const hashedPassword = await AuthService.hashPassword(password);

      // Crear usuario
      const user = new User({
        nombre,
        apellido,
        email: email.toLowerCase(),
        password: hashedPassword,
        telefono,
        organization_id: organization._id,
        roles: ['user'], // Rol por defecto
        created_by: null // Primer usuario de la organización
      });

      await user.save();

      // Actualizar organization con created_by
      if (!organization.created_by) {
        organization.created_by = user._id;
        await organization.save();
      }

      // Generar tokens
      const { accessToken, refreshToken } = AuthService.generateTokensForUser(user);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: user.toPublicJSON(),
          organization: {
            id: organization._id,
            nombre: organization.nombre,
            codigo: organization.codigo
          },
          tokens: {
            accessToken,
            refreshToken
          }
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Refresh token
  static async refreshToken(req: Request<{}, {}, RefreshTokenRequest>, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token requerido'
        });
        return;
      }

      // Verificar refresh token
      const decoded = AuthService.verifyRefreshToken(refreshToken);
      
      // Buscar usuario
      const user = await User.findById(decoded.userId)
        .populate('organization_id', 'nombre codigo activo');

      if (!user || !user.activo) {
        res.status(401).json({
          success: false,
          message: 'Usuario no válido'
        });
        return;
      }

      // Verificar que la organización esté activa
      if (!user.organization_id || !(user.organization_id as any).activo) {
        res.status(401).json({
          success: false,
          message: 'Organización inactiva'
        });
        return;
      }

      // Generar nuevos tokens
      const { accessToken, refreshToken: newRefreshToken } = AuthService.generateTokensForUser(user);

      res.json({
        success: true,
        message: 'Tokens renovados exitosamente',
        data: {
          tokens: {
            accessToken,
            refreshToken: newRefreshToken
          }
        }
      });
    } catch (error) {
      console.error('Error en refresh token:', error);
      res.status(401).json({
        success: false,
        message: 'Refresh token inválido'
      });
    }
  }

  // Logout (opcional - principalmente para invalidar tokens en el cliente)
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      // En una implementación más avanzada, podrías invalidar el token en una blacklist
      res.json({
      success: true,
        message: 'Logout exitoso'
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener perfil del usuario autenticado
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Perfil obtenido exitosamente',
        data: {
          user: req.user.toPublicJSON()
        }
      });
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}