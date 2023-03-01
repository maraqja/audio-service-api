import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArtistService } from 'src/artist/artist.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album, AlbumDocument } from './schemas/album.schema';

@Injectable()
export class AlbumService {


    constructor(
        @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
        private readonly artistService: ArtistService
        ) {}

    async getAll(): Promise<Album[]> {
        return this.albumModel.find()
        .populate('artists') // раскрываем по ObjectId артистов
        .exec();
    }

    // async getAll_unused(searchTerm?: string): Promise<Album[]> { // метод для поиска всех сразу по query
    //     let options = {}

    //     if (searchTerm) {
    //         options = {
    //             $or: [
    //                 {
    //                     title: new RegExp(searchTerm, 'i')
    //                 },
    //                 {
    //                     headArtist: new RegExp(searchTerm, 'i') // добавить поле главного исполнителя в схему артистов
    //                 }
    //             ]
    //         }
    //     }

    //     return this.albumModel.find(options)
    //     .sort({
    //         release_date: 'desc'
    //     })
    //     .exec()
    // }

    async getById(id: string): Promise<Album> {
        return this.albumModel.findById(id).
        populate('artists').
        exec();
    }

    async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
        const createdAlbum = new this.albumModel(createAlbumDto);
        return createdAlbum.save();
    }

    async remove(id: string): Promise<Album> {
        return this.albumModel.findByIdAndRemove(id)
    }

    async update(id: string, updateAlbumDto: CreateAlbumDto): Promise<Album> {
        return this.albumModel.findByIdAndUpdate(id, updateAlbumDto, {new: true}) // new: true - если запись не найдена, то создадим
    }


    async getByName(title: string): Promise<Album[]> {
        return this.albumModel.find( {title: new RegExp(title, 'i')} ) // регэксп чтобы не зависел от регистра и если name является частью имени (как Test в test name)
        .populate('artists')
        .exec();
    }

    async getByArtist(name: string): Promise<Album[]> {
        const artist = await this.artistService.getByName(name)
        // console.log(artist)
        return this.albumModel.find ( { artists: artist } )
        .populate('artists')
        .exec();
    }



    // addOwner(catId: string, ownerId: string) {
    //     return this.model.findByIdAndUpdate(
    //     catId,
    //     { $addToSet: { owners: ownerId } },
    //     { new: true },
    //     );
    // }
    // removeOwner(catId: string, ownerId: string) {
    //     return this.model.findByIdAndUpdate(
    //     catId,
    //     { $pull: { owners: ownerId } },
    //     { new: true },
    //     );
    // }



}
