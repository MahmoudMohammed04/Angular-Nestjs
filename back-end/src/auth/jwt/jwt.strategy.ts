import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // console.log(process.env.AUTH0_DOMAIN);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      audience: process.env.AUTH0_AUDIENCE,
 
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,

      algorithms: ['RS256'],

      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
      }),
    });
  }

  async validate(payload: any) {
    return payload;
  }
}