import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata, ParseUUIDPipe, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth, GetUser } from './decorators';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Get('/check')
  @Auth()
  checkAuthStatus(@GetUser() user: User,) {
    return this.authService.checkAuthStatus(user);
  }
  @Post('/google/mobile')
  async googleAuthMobile(@Body() body: { token: string }) {
    console.log('body');  
    return this.authService.verifyGoogleToken(body.token);
  }

}
