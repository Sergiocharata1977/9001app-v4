import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  
  // Hash de contraseña
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  // Verificar contraseña
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Generar tokens para usuario
  static generateTokensForUser(user: any) {
    const payload = {
      userId: user._id,
      email: user.email,
      organizationId: user.organization_id
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  // Verificar refresh token
  static verifyRefreshToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
  }
}