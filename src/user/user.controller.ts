import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserPreferencesDto } from './dto/user-preferences.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {


    constructor(private readonly userService: UserService) {}


    @Post('register')
	async register(@Body() createUserDto: CreateUserDto) {
		return this.userService.register(createUserDto);
	}


    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getById(@Param('id') id: string): Promise<User> {
        return this.userService.getById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get() 
    async getByUsername(@Query() query) {
        console.log(query.username)
        return this.userService.getByUsername(query.username);
    }


    @UseGuards(JwtAuthGuard)
    @Put(':id/add/preferences') 
    updatePreferences(@Body() userPreferencesDto: UserPreferencesDto, @Param('id') id: string): Promise<User>{
        return this.userService.updatePreferences(id, userPreferencesDto)
    }


    @UseGuards(JwtAuthGuard)
    @Put(':id/add/favorite')
    updateFavoriteTracks(@Body() { trackId }, @Param('id') id: string): Promise<User>{
        console.log(trackId)
        return this.userService.updateFavoriteTracks(id, trackId)
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/get/favorites') 
    async getFavoriteTracks(@Param('id') id) {
        console.log(id)
        return this.userService.getFavoriteTracks(id)
        // console.log(query.username)
        // return this.userService.getByUsername(query.username);
    }

    

}
