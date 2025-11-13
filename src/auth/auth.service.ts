import {Prisma, Usuario } from '@prisma/client'
import { UserService } from './../user/user.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private UserService: UserService) {}

    async signIn(params: Prisma.UsuarioCreateInput): Promise<any> {
        const user = await this.UserService.user({ email: params.email });
        if (!user) throw new NotFoundException('User not found');
        
        const passwordMatch = await bcrypt.compare(params.senha, user.senha);
        if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');
        
        const { senha, ...result } = user;
        return result;
    }
}
