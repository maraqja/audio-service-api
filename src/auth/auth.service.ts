import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {


    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
        ) {}


    async login(loginDto: LoginDto) { // проверяем есть ли пользователь и правильный ли пароль, после чего возвращаем токен, в который зашифрован весь пользователь
        const user = await this.userService.getByUsername(loginDto.username)
        if (!user) {
			throw new UnauthorizedException('User not found');
		}
		const isCorrectPassword = await compare(loginDto.password, user.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException('Wrong password');
		}
		// const payload = { username: user.username, email: user.email }
		const payload = { data: user } 
		return {
                // access_token: user
			access_token: await this.jwtService.signAsync(payload)
		};
	}


}
