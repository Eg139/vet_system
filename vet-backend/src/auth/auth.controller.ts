import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { OnboardingDto } from './dto/onboarding.dto';
import { LoginDto } from './dto/login.dto';
import { ActiveUser } from './decorators/active-user.decorator';
import { LicenseGuard } from 'src/licensing/guards/license.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('onboarding')
  async onboarding(@Body() onboardingDto: OnboardingDto) {
    return await this.authService.onboarding(onboardingDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, LicenseGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('my-org')
  @UseGuards(JwtAuthGuard)
  getOnlyOrg(@ActiveUser('orgId') orgId: string) {
    return { message: `Tu veterinaria es la ID: ${orgId}` };
  }

  @Get('check-license-status')
@UseGuards(JwtAuthGuard, LicenseGuard) // <--- Aquí es donde se activa
testLicense(@ActiveUser() user: any) {
  return {
    message: 'Tu licencia está activa y puedes usar los módulos médicos.',
    data: user
  };
}
}