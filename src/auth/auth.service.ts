import { UserService } from './../user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(private UserService: UserService) {}

  
}
