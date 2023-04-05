import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { Playlist, PlaylistDocument, PlaylistSource } from './schemas/playlist.schema';

@Injectable()
export class PlaylistService {

    constructor(
        @InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>
        ) {}

    async getAll(): Promise<Playlist[]> {
        return this.playlistModel.find()
        .populate({
            path: 'tracks',
            populate: { path: 'album', populate: {
                path: 'artists'
            }}
        })
        .exec();



    }

    async getById(id: string): Promise<Playlist> {
        return this.playlistModel.findById(id)
        .populate('tracks')
        .exec();
    }

    async create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
        const createdPlaylist = new this.playlistModel(createPlaylistDto);
        return createdPlaylist.save();
    }

    async remove(id: string): Promise<Playlist> {
        return this.playlistModel.findByIdAndRemove(id)
    }

    async update(id: string, updatePlaylistDto: CreatePlaylistDto): Promise<Playlist> {
        return this.playlistModel.findByIdAndUpdate(id, updatePlaylistDto, {new: true}) // new: true - если запись не найдена, то создадим
    }

    async getBySource(source: PlaylistSource): Promise<Playlist[]> {
        console.log(source)
        return this.playlistModel.find( { source }  )
        .populate('tracks')
        .exec()
    }


    async updateRecPlaylist (userId: string, name: string, updatePlaylistDto: CreatePlaylistDto) { // name - для того чтобы определять CB/CF/Hybrid/Popularity (т.к. source rec - одинаков для них всех)
        return this.playlistModel.findOneAndUpdate(
            { owner: userId, name },
            updatePlaylistDto,
            { new:true, upsert: true }
        )
    }



}
