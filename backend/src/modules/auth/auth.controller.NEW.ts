import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Organization } from '../organizations/organization.model.js';
import { User } from '../users/user.model.js';

// Interfaces
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  organization_name?: string;
  organization_code?: string;
}

interface SetPasswordRequest {
  email: string;
  password: string;
}

export class AuthControllerNEW {
  
  // 🔐 LOGIN SIMPLIFICADO
  static async login(req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> {
    try {
      console.log('🔐 [NEW] Intento de login:', { 
        email: req.body.email, 
        passwordLength: req.body.password?.length 
      });

      const { email, password } = req.body;

      // Validación básica
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
        return;
      }

      // Buscar usuario (sin restricciones de activo)
      const user = await User.findOne({ 
        email: email.toLowerCase() 
      }).populate('organization_id');

      console.log('👤 Usuario encontrado:', user ? 'Sí' : 'No');
      
      if (!user) {
        console.log('❌ Usuario no encontrado');
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
        return;
      }

      // Verificar contraseña (compatible con ambos campos)
      const userPassword = user.password_hash || user.password;
      console.log('🔑 Campo de contraseña:', userPassword ? 'Encontrado' : 'No encontrado');
      
      if (!userPassword) {
        console.log('❌ Usuario sin contraseña configurada');
        res.status(401).json({
          success: false,
          message: 'Usuario sin contraseña. Contacte al administrador.'
        });
        return;
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, userPassword);
      console.log('🔐 Contraseña válida:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('❌ Contraseña incorrecta');
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
        return;
      }

      // Generar token JWT
      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email,
          organizationId: user.organization_id?._id
        },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );

      console.log('✅ Login exitoso');

      // Respuesta exitosa
      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          user: {
            id: user._id,
            nombre: user.nombre || user.name || 'Usuario',
            apellido: user.apellido || 'Sistema',
            email: user.email,
            roles: user.roles || ['user'],
            organization: user.organization_id ? {
              id: user.organization_id._id,
              nombre: user.organization_id.nombre,
              codigo: user.organization_id.codigo
            } : null
          },
          token
        }
      });

    } catch (error) {
      console.error('❌ Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // 📝 REGISTRO SIMPLIFICADO
  static async register(req: Request<{}, {}, RegisterRequest>, res: Response): Promise<void> {
    try {
      console.log('📝 [NEW] Intento de registro:', { email: req.body.email });

      const { nombre, apellido, email, password, telefono, organization_name, organization_code } = req.body;

      // Validación básica
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

      // Crear o encontrar organización
      let organization;
      if (organization_name && organization_code) {
        // Verificar si la organización ya existe
        const existingOrg = await Organization.findOne({ 
          codigo: organization_code.toUpperCase() 
        });
        
        if (existingOrg) {
          res.status(409).json({
            success: false,
            message: 'El código de organización ya existe'
          });
          return;
        }

        // Crear nueva organización
        organization = new Organization({
          nombre: organization_name,
          codigo: organization_code.toUpperCase(),
          activo: true
        });
        await organization.save();
        console.log('🏢 Organización creada:', organization.nombre);
      } else {
        // Usar organización por defecto o la primera disponible
        organization = await Organization.findOne({ activo: true });
        if (!organization) {
          res.status(400).json({
            success: false,
            message: 'No hay organizaciones disponibles'
          });
          return;
        }
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 12);

      // Crear usuario
      const user = new User({
        nombre,
        apellido,
        email: email.toLowerCase(),
        password: hashedPassword,
        telefono,
        roles: ['user'],
        organization_id: organization._id,
        activo: true,
        configuracion: {
          tema: 'light',
          idioma: 'es',
          notificaciones: true
        }
      });

      await user.save();
      console.log('👤 Usuario creado:', user.email);

      // Generar token
      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email,
          organizationId: organization._id
        },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: {
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            roles: user.roles,
            organization: {
              id: organization._id,
              nombre: organization.nombre,
              codigo: organization.codigo
            }
          },
          token
        }
      });

    } catch (error) {
      console.error('❌ Error en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // 🔧 ESTABLECER CONTRASEÑA (Solo desarrollo)
  static async setPassword(req: Request<{}, {}, SetPasswordRequest>, res: Response): Promise<void> {
    try {
      console.log('🔧 [NEW] Establecer contraseña:', { email: req.body.email });

      // Solo en desarrollo
      if (process.env.NODE_ENV === 'production') {
        res.status(403).json({
          success: false,
          message: 'No disponible en producción'
        });
        return;
      }

      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
        return;
      }

      // Buscar usuario
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }

      // Hash de la nueva contraseña
      const hashedPassword = await bcrypt.hash(password, 12);

      // Actualizar directamente en la base de datos
      await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        password_hash: hashedPassword // Compatibilidad
      }, { 
        runValidators: false 
      });

      console.log('✅ Contraseña establecida para:', email);

      res.json({
        success: true,
        message: 'Contraseña establecida exitosamente',
        data: {
          email: user.email,
          passwordSet: true
        }
      });

    } catch (error) {
      console.error('❌ Error estableciendo contraseña:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // 🧪 CREAR USUARIO DE PRUEBA
  static async createTestUser(req: Request, res: Response): Promise<void> {
    try {
      console.log('🧪 [NEW] Crear usuario de prueba');

      // Solo en desarrollo
      if (process.env.NODE_ENV === 'production') {
        res.status(403).json({
          success: false,
          message: 'No disponible en producción'
        });
        return;
      }

      // Crear organización de prueba si no existe
      let organization = await Organization.findOne({ codigo: 'TEST' });
      if (!organization) {
        organization = new Organization({
          nombre: 'Organización de Prueba',
          codigo: 'TEST',
          activo: true
        });
        await organization.save();
      }

      // Crear usuario de prueba si no existe
      let user = await User.findOne({ email: 'admin@test.com' });
      if (!user) {
        const hashedPassword = await bcrypt.hash('123456', 12);
        
        user = new User({
          nombre: 'Admin',
          apellido: 'Test',
          email: 'admin@test.com',
          password: hashedPassword,
          roles: ['admin'],
          organization_id: organization._id,
          activo: true,
          configuracion: {
            tema: 'light',
            idioma: 'es',
            notificaciones: true
          }
        });
        
        await user.save();
      }

      res.json({
        success: true,
        message: 'Usuario de prueba creado exitosamente',
        data: {
          email: 'admin@test.com',
          password: '123456',
          organization: organization.nombre
        }
      });

    } catch (error) {
      console.error('❌ Error creando usuario de prueba:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // 👤 OBTENER PERFIL
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'Token no proporcionado'
        });
        return;
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      
      const user = await User.findById(decoded.userId).populate('organization_id');
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            nombre: user.nombre || user.name || 'Usuario',
            apellido: user.apellido || 'Sistema',
            email: user.email,
            roles: user.roles || ['user'],
            organization: user.organization_id ? {
              id: user.organization_id._id,
              nombre: user.organization_id.nombre,
              codigo: user.organization_id.codigo
            } : null
          }
        }
      });

    } catch (error) {
      console.error('❌ Error obteniendo perfil:', error);
      res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
  }
}