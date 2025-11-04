import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, Usuario as UserModel } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signupUser(
    @Body() userData: Prisma.UsuarioCreateInput,
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }
}
