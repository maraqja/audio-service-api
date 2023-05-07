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

// Стратегия определяет, как кодировать учетные данные, такие как пароль или емейл, в запросе. Они также определяют процедуру, необходимую для проверки этих учетных данных. Если учетные данные успешно проверены, запрос аутентифицируется.

// ДОБАВЛЯЕМ В ПРОВАЙДЕРЫ МОДУЛЯ

// вообще можно без этого, тогда jwt.guard.ts будет выглядеть иначе