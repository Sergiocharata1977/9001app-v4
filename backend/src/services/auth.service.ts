import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser } from '../modules/users/user.model.js';

// Interfaces para tokens
export interface TokenPayload {
  userId: string;
  email: string;
  organizationId: string;
  roles: string[];
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private static readonly ACCESS_TOKEN_EXPIRES_IN = '15m';
  private static readonly REFRESH_TOKEN_EXPIRES_IN = '7d';
  private static readonly SALT_ROUNDS = 12;

  /**
   * Hash de contraseña
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verificar contraseña
   */
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generar par de tokens (access + refresh)
   */
  static generateTokenPair(payload: TokenPayload): TokenPair {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: this.ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId: payload.userId },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Verificar access token
   */
  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  }

  /**
   * Verificar refresh token
   */
  static verifyRefreshToken(token: string): { userId: string } {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string };
  }

  /**
   * Generar payload para tokens
   */
  static generateTokenPayload(user: IUser): TokenPayload {
    return {
      userId: user._id.toString(),
      email: user.email,
      organizationId: user.organization_id.toString(),
      roles: user.roles
    };
  }

  /**
   * Generar tokens para usuario
   */
  static generateTokensForUser(user: IUser): TokenPair {
    const payload = this.generateTokenPayload(user);
    return this.generateTokenPair(payload);
  }

  /**
   * Validar fortaleza de contraseña
   */
  static validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    if (password.length > 128) {
      errors.push('La contraseña no puede exceder 128 caracteres');
    }

    // Opcional: agregar más validaciones de fortaleza
    // if (!/[A-Z]/.test(password)) {
    //   errors.push('La contraseña debe contener al menos una letra mayúscula');
    // }

    // if (!/[a-z]/.test(password)) {
    //   errors.push('La contraseña debe contener al menos una letra minúscula');
    // }

    // if (!/\d/.test(password)) {
    //   errors.push('La contraseña debe contener al menos un número');
    // }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generar token de reset de contraseña
   */
  static generatePasswordResetToken(userId: string): string {
    return jwt.sign(
      { userId, type: 'password_reset' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
  }

  /**
   * Verificar token de reset de contraseña
   */
  static verifyPasswordResetToken(token: string): { userId: string; type: string } {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (payload.type !== 'password_reset') {
      throw new Error('Token inválido para reset de contraseña');
    }

    return payload;
  }
}

