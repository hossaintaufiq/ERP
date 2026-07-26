import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { JsonFileStore } from '../../common/storage/json-file.store';
import { JsonRepository } from '../../common/repository/json.repository';
import { Entity } from '../../common/repository/repository.interface';

interface UserEntity extends Entity {
  email: string;
  name: string;
  role: string;
  passwordHash: string;
  companyId: string;
  status: string;
}

interface RoleEntity extends Entity {
  id: string;
  name: string;
  permissions: string[];
}

@Injectable()
export class AuthService {
  private users: JsonRepository<UserEntity>;
  private roles: JsonRepository<RoleEntity>;
  private audit: JsonRepository<any>;

  constructor(
    private readonly jwt: JwtService,
    store: JsonFileStore,
  ) {
    this.users = new JsonRepository(store, 'users');
    this.roles = new JsonRepository(store, 'roles');
    this.audit = new JsonRepository(store, 'audit');
  }

  async validateUser(email: string, password: string) {
    const user = await this.users.findOne((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const role = await this.roles.findById(user.role);
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: role?.permissions ?? [],
      companyId: user.companyId,
      name: user.name,
    };
    const accessToken = await this.jwt.signAsync(payload);
    const refreshToken = await this.jwt.signAsync(payload, { expiresIn: '7d' });

    await this.audit.create({
      action: 'LOGIN',
      entity: 'User',
      entityId: user.id,
      userId: user.id,
      userName: user.name,
      details: 'User logged in',
      ip: '0.0.0.0',
      companyId: user.companyId,
    } as any);

    const { passwordHash, ...safe } = user;
    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: '8h',
      user: { ...safe, permissions: payload.permissions },
    };
  }

  async refresh(token: string) {
    try {
      const decoded = await this.jwt.verifyAsync(token);
      const user = await this.users.findById(decoded.sub);
      if (!user) throw new UnauthorizedException();
      const role = await this.roles.findById(user.role);
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        permissions: role?.permissions ?? [],
        companyId: user.companyId,
        name: user.name,
      };
      return {
        accessToken: await this.jwt.signAsync(payload),
        refreshToken: await this.jwt.signAsync(payload, { expiresIn: '7d' }),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async profile(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) throw new UnauthorizedException();
    const role = await this.roles.findById(user.role);
    const { passwordHash, ...safe } = user;
    return { ...safe, permissions: role?.permissions ?? [] };
  }

  async forgotPassword(email: string) {
    const user = await this.users.findOne((u) => u.email.toLowerCase() === email.toLowerCase());
    return {
      message: 'If the account exists, a reset link has been sent (mock).',
      mockToken: user ? `reset-${user.id}` : null,
    };
  }
}
