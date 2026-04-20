import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/index';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';
const JWT_EXPIRATION: string = process.env.JWT_EXPIRATION || '7d';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET as string, { expiresIn: JWT_EXPIRATION as any });
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static async register(email: string, password: string, firstName: string = '', lastName: string = '') {
    // Check if user exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password and create user
    const passwordHash = await this.hashPassword(password);
    const user = await UserModel.create(email, passwordHash, firstName, lastName);

    // Generate token
    const token = this.generateToken(user.id);

    return { user, token };
  }

  static async login(email: string, password: string) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const passwordHash = await UserModel.getPasswordHash(email);
    if (!passwordHash || !(await this.verifyPassword(password, passwordHash))) {
      throw new Error('Invalid password');
    }

    const token = this.generateToken(user.id);
    return { user, token };
  }
}

export class RateLimitService {
  private static limits = new Map<string, { count: number; resetTime: number }>();

  static isRateLimited(userId: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const userLimit = this.limits.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
      this.limits.set(userId, { count: 1, resetTime: now + windowMs });
      return false;
    }

    if (userLimit.count >= maxRequests) {
      return true;
    }

    userLimit.count++;
    return false;
  }
}
