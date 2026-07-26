import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AuthService } from './auth.service';
import { CurrentUser, Public } from '../../common/decorators/auth.decorators';

class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

class RefreshDto {
  @IsString()
  refreshToken: string;
}

class ForgotDto {
  @IsEmail()
  email: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Public()
  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  @Public()
  @Post('forgot-password')
  forgot(@Body() dto: ForgotDto) {
    return this.auth.forgotPassword(dto.email);
  }

  @Post('logout')
  logout() {
    return { message: 'Logged out' };
  }

  @ApiBearerAuth()
  @Get('me')
  me(@CurrentUser() user: any) {
    return this.auth.profile(user.sub || user.id);
  }
}
