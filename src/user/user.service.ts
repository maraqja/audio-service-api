import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { genSalt, hash } from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { Role } from './enums/user_role.enum';
import { UserPreferencesDto } from './dto/user-preferences.dto';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}


    async create(createUserDto: CreateUserDto): Promise<User> {
        const salt = await genSalt(10);
        const createdUser = new this.userModel({
            username: createUserDto.username,
            email: createUserDto.email,
            passwordHash: await hash(createUserDto.password, salt),
            image: 'default.png',
            role: [Role.User],
            preferences: {},
            favoriteTracks: []
		});
        return createdUser.save();
    }

    async getByUsername(username: string): Promise<User> {
		return this.userModel.findOne({ username }).exec();
	}

    async getByEmail(email: string): Promise<User> {
		return this.userModel.findOne({ email }).exec();
	}


    async register(createUserDto: CreateUserDto): Promise<User> {
        const existedUserByUsername = await this.getByUsername(createUserDto.username) // await тк иначе промис pending (в ожидании)
        if (existedUserByUsername) {
            throw new BadRequestException('This username is already registered');
        }
        const existedUserByEmail = await this.getByEmail(createUserDto.email)
        if (existedUserByEmail) {
            throw new BadRequestException('This email is already registered');
        }
        return this.create(createUserDto)
    }


    async getById(id: string): Promise<User> {
        return this.userModel.findById(id).exec();
    }

    async updatePreferences(id: string, userPreferencesDto: UserPreferencesDto): Promise<User> {
        return this.userModel.findByIdAndUpdate(id, {$set:{preferences: userPreferencesDto} }, { new: true } ).exec() // new: true означает, что вернется обновленный объект в ответе
    }


    async updateFavoriteTracks(id: string, trackId: string): Promise<User> {
        return this.userModel.findByIdAndUpdate(id, {$push:{favoriteTracks: trackId} }, { new: true } ).exec() // new: true означает, что вернется обновленный объект в ответе
    }

    async getFavoriteTracks(id: string): Promise<User> {
        return this.userModel.findById(id, 'favoriteTracks')
        .populate('favoriteTracks')
        .exec()
        // .then((data) => data.favoriteTracks)
    }
}
