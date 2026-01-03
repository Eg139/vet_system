import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extrae el token del header: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // IMPORTANTE: Usa la misma clave que pusiste en AuthModule
      secretOrKey: process.env.JWT_SECRET || 'secretKeyPrivada',
    });
  }

  // Este método es el que inyecta los datos en req.user
  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      email: payload.email, 
      orgId: payload.orgId, // <--- ¡Aquí recuperamos la veterinaria!
      isLicenseActive: payload.isLicenseActive
    };
  }
}