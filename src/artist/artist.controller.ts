import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Artist } from 'src/artist/schemas/artist.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/user/enums/user_role.enum';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';

@Controller('artist')
export class ArtistController {


    constructor(private readonly artistService: ArtistService) {}



    @UseGuards(JwtAuthGuard) // Header: Authorization, Value: Bearer acess_token, или в Инсомнии в Auth указать Bearer и туда сунуть токен
    @Get()
    async getAll(@Query() query): Promise<Artist[]> {

        if (!(Object.keys(query).length === 0 && query.constructor === Object)) { // если не пустой объект Query, то к query ищем поле name с ним вызываем функцию getByName
            if (query.name) {
                console.log(query)
                return this.artistService.getByName(query.name)
            }

        } else {
            return this.artistService.getAll();
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getById(@Param('id') id: string): Promise<Artist> {
        return this.artistService.getById(id);
    }

    
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post('create')
    async create(@Body() createArtistDto: CreateArtistDto): Promise<Artist> {
        return this.artistService.create(createArtistDto);
    }

    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    remove(@Param('id') id: string): Promise<Artist> {
        return this.artistService.remove(id)
    }

    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Put(':id')
    update(@Body() updateArtistDto: CreateArtistDto, @Param('id') id: string): Promise<Artist> {
        return this.artistService.update(id, updateArtistDto)
  }

}
