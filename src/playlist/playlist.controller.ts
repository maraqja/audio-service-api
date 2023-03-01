import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { PlaylistService } from './playlist.service';
import { Playlist } from './schemas/playlist.schema';

@Controller('playlist')
export class PlaylistController {

    constructor(private readonly playlistService: PlaylistService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@Query() query): Promise<Playlist[]> { // Просто получаем все треки или получаем все треки по названию трека (должно быть задано query: ?name=название трека )
        
        if (!(Object.keys(query).length === 0 && query.constructor === Object)) { // если не пустой объект Query, то к query ищем поле name с ним вызываем функцию getByName
            if (query.source) {
                console.log(query.source)
                return this.playlistService.getBySource(query.source)
            }
        }
        return this.playlistService.getAll()
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getById(@Param('id') id: string): Promise<Playlist> {
        return this.playlistService.getById(id);
    }


    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Body() createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
        return this.playlistService.create(createPlaylistDto);
    }


    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Playlist> {
        return this.playlistService.remove(id)
    }


    @UseGuards(JwtAuthGuard)    
    @Put(':id')
    async update(@Body() updatePlaylistDto: CreatePlaylistDto, @Param('id') id: string): Promise<Playlist> {
        return this.playlistService.update(id, updatePlaylistDto)
    }


}
