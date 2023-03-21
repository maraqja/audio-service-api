import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/user/enums/user_role.enum';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './schemas/track.schema';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {


    constructor(private readonly trackService: TrackService) {}


    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@Query() query): Promise<Track[]> { // Просто получаем все треки или получаем все треки по названию трека (должно быть задано query: ?name=название трека )
        // console.log(query)
        // console.log(Object.keys(query).length === 0 && query.constructor === Object) // проверка на пустой объект
        if (!(Object.keys(query).length === 0 && query.constructor === Object)) { // если не пустой объект Query, то к query ищем поле name с ним вызываем функцию getByName
            if (query.name) {
                console.log(query.name)
                return this.trackService.getByName(query.name)
            }
            if (query.artist) {
                console.log(query.artist)
                return this.trackService.getByArtist(query.artist)
            }
            if (query.album_id) {
                console.log(query.album_id)
                return this.trackService.getByAlbumId(query.album_id)
            }

        } else {
            return this.trackService.getAll();
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getById(@Param('id') id: string): Promise<Track> {
        return this.trackService.getById(id);
    }


    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post('create')
    async create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
        return this.trackService.create(createTrackDto);
    }

    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Track> {
        return this.trackService.remove(id)
    }

    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RoleGuard)    
    @Put(':id')
    async update(@Body() updateTrackDto: CreateTrackDto, @Param('id') id: string): Promise<Track> {
        return this.trackService.update(id, updateTrackDto)
    }


}
