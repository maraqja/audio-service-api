import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/schemas/user.schema';
import { jwtConstants } from '../constants/jwt.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: jwtConstants.secret
		});
	}

	async validate(user: User) {
		return user;
	}
}


// НУЖНО ДЛЯ ГУАРДА

// СТРАТЕГИЯ ПРОВЕРЯЕТ JWT TOKEN И ОПРЕДЕЛЯЕТ ПУСКАТЬ ИЛИ НЕ ПУСКАТЬ НА ОПРЕДЕЛЕННЫЙ РОУТ

// ДОБАВЛЯЕМ В ПРОВАЙДЕРЫ МОДУЛЯ