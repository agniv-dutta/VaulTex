import { AppError } from '../../lib/errors';
import { signAccessToken } from '../../lib/jwt';
import { comparePassword, hashPassword } from '../../lib/password';
import { serializeUser, type ApiUser } from '../../lib/serializers';
import { usersRepository } from '../users/users.repository';

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

export class AuthService {
  async register(input: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const existingUser = await usersRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    const hashedPassword = await hashPassword(input.password);
    const user = await usersRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword
    });

    return {
      token: signAccessToken({ userId: user.id, email: user.email, role: user.role }),
      user: serializeUser(user)
    };
  }

  async login(input: { email: string; password: string }): Promise<AuthResponse> {
    const user = await usersRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await comparePassword(input.password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    return {
      token: signAccessToken({ userId: user.id, email: user.email, role: user.role }),
      user: serializeUser(user)
    };
  }
}

export const authService = new AuthService();
