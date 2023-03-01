import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/user/enums/user_role.enum';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './schemas/album.schema';

@Controller('album')
export class AlbumController {

    
    constructor(private readonly albumService: AlbumService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@Query() query): Promise<Album[]> {

        if (!(Object.keys(query).length === 0 && query.constructor === Object)) { // если не пустой объект Query, то к query ищем поле name с ним вызываем функцию getByName
            if (query.title) {
                console.log(query.title)
                return this.albumService.getByName(query.title)
            }
            if (query.artist_name) {
                console.log(query.artist_name)
                return this.albumService.getByArtist(query.artist_name)
            }

        } else {
            return this.albumService.getAll();
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getById(@Param('id') id: string): Promise<Album> {
        return this.albumService.getById(id);
    }

    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post('create')
    async create(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
        return this.albumService.create(createAlbumDto);
    }

    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Album> {
        return this.albumService.remove(id)
    }
    
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Put(':id')
    async update(@Body() updateAlbumtDto: CreateAlbumDto, @Param('id') id: string): Promise<Album> {
        return this.albumService.update(id, updateAlbumtDto)
    }


// Patch частично изменяет, PUT - полностью
// @Patch('/:id/add-owner/:ownerId')
//     addOwner(@Param('id') catId: string, @Param('ownerId') ownerId: string) {
//         return this.catsService.addOwner(catId, ownerId);
// }
// @Patch('/:id/remove-owner/:ownerId')
//     removeOwner(@Param('id') catId: string, @Param('ownerId') ownerId: string) {
//     return this.catsService.removeOwner(catId, ownerId);
// }


// @Get('/:id/owners')
//     getOwners(@Param('id') catId: string) {
//         return this.catsService.getOwners(catId);
// }

}
