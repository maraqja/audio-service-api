import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from 'src/artist/schemas/artist.schema';
import { CreateArtistDto } from './dto/create-artist.dto';

@Injectable()
export class ArtistService {

    constructor(@InjectModel(Artist.name) private artistModel: Model<ArtistDocument>) {}

    async getAll(): Promise<Artist[]> {
        return this.artistModel.find().exec();
    }

    async getById(id: string): Promise<Artist> {
        return this.artistModel.findById(id).exec();
    }

    async create(createArtistDto: CreateArtistDto): Promise<Artist> {
        const createdArtist = new this.artistModel(createArtistDto);
        return createdArtist.save();
    }

    async remove(id: string): Promise<Artist> {
        return this.artistModel.findByIdAndRemove(id)
    }

    async update(id: string, updateArtistDto: CreateArtistDto): Promise<Artist> {
        return this.artistModel.findByIdAndUpdate(id, updateArtistDto, {new: true}) // new: true - если запись не найдена, то создадим
    }

    async getByName(name: string): Promise<Artist[]> {
        return this.artistModel.find( {name: new RegExp(name, 'i')} ) // регэксп чтобы не зависел от регистра и если name является частью имени (как Test в test name)
        .exec()
    }
    



}
