import {

  Injectable,

} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,

  ) { }
  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ email: user.email, id: user.id }),
    };
  }



  async getGoogleProfile(token: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return {
      email: payload?.email,
      firstName: payload?.given_name,
      lastName: payload?.family_name,
      picture: payload?.picture,
    };
  }
  async verifyGoogleToken(token: string) {
    const profile = await this.getGoogleProfile(token);

    let user = await this.userRepository.findOne({
      where: { email: profile.email },
      select: {
        email: true,
        secret: true,
        name: true,
        birthday: true,
        phone: true,
        dni: true,
        lastname: true,
        isActive: true,
        roles: true,
        verify: true,
        createdAt: true,
        id: true,
      },
    });

    if (!user) {
      user = this.userRepository.create({
        name: profile.firstName || 'Unknown',
        email: profile.email,
        lastname: profile.lastName || 'Unknown',
        birthday: new Date(),
        password: bcrypt.hashSync(uuidv4(), 10),
        verify: true,
      });

      await this.userRepository.save(user);
    }

    delete user.password;

    const jwtToken = this.getJwtToken({ email: user.email, id: user.id });
    return {
      ...user,
      token: jwtToken,
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }


}
