import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track, TrackDocument } from './schemas/track.schema';

@Injectable()
export class TrackService {

    constructor(
        @InjectModel(Track.name) private trackModel: Model<TrackDocument>
        ) {}

    async getAll(): Promise<Track[]> {
        return this.trackModel.find()
        .populate({
            path: 'album',
            populate: { path: 'artists' }
        }) // раскрываем по ObjectId альбома и дальше по ObjectId артистов
        .exec();
    }

    async getById(id: string): Promise<Track> {
        return this.trackModel.findById(id)
        .populate({
            path: 'album',
            populate: { path: 'artists' }
        })
        .exec();
    }

    async create(createTrackDto: CreateTrackDto): Promise<Track> {
        const createdTrack = new this.trackModel(createTrackDto);
        return createdTrack.save();
    }

    async remove(id: string): Promise<Track> {
        return this.trackModel.findByIdAndRemove(id)
    }

    async update(id: string, updateTrackDto: CreateTrackDto): Promise<Track> {
        return this.trackModel.findByIdAndUpdate(id, updateTrackDto, {new: true}) // new: true - если запись не найдена, то создадим
    }


    async getByName(name: string): Promise<Track[]> {
        return this.trackModel.find( {name: new RegExp(name, 'i')} ) // регэксп чтобы не зависел от регистра и если name является частью имени (как Test в test name)
        .populate({
            path: 'album',
            populate: { path: 'artists' }
        })
        .exec()
    }

    async getByArtist(artist: string): Promise<Track[]> {
        // другой способ в отличии от того, как это реализовано в альбомах
        //populate похож на lookup, но populate выполняет множественные запросы, а lookup соединение (аля левое в реалиционных)
        //  return this.trackModel.find()
        // .populate({
        //     path: 'album',
        //     populate: { path: 'artists' }
        // }) // раскрываем по ObjectId альбома и дальше по ObjectId артистов
        // .exec();

        return this.trackModel.aggregate().lookup({
            from: 'albums',
            localField: 'album',
            foreignField: '_id',
            as: 'album'
        }).unwind({
            path: '$album'
        }).lookup({
            from: 'artists',
            localField: 'album.artists',
            foreignField: '_id',
            as: 'album.artists'
        }) // до этого момента тот же самый populate как и в getAll
        .match({'album.artists.name': artist})
        .exec()
    }


    async getByAlbumId(album_id: string): Promise<Track[]> { // здесь, т.к. возвращает промис Track[] (по сути в сущности альбома ничего про треки, только треки знают о том, в каких они альбомах)
        // другой способ в отличии от того, как это реализовано в альбомах
        //populate похож на lookup, но populate выполняет множественные запросы, а lookup соединение (аля левое в реалиционных)
        //  return this.trackModel.find()
        // .populate({
        //     path: 'album',
        //     populate: { path: 'artists' }
        // }) // раскрываем по ObjectId альбома и дальше по ObjectId артистов
        // .exec();

        return this.trackModel.aggregate().lookup({
            from: 'albums',
            localField: 'album',
            foreignField: '_id',
            as: 'album'
        }).unwind({
            path: '$album'
        }).lookup({
            from: 'artists',
            localField: 'album.artists',
            foreignField: '_id',
            as: 'album.artists'
        }) // до этого момента тот же самый populate как и в getAll
        .unwind({
            path: '$album.artists'
        })
        .match({'album._id': new mongoose.Types.ObjectId(album_id)})
        .group({
            _id: '$album._id',
            title: {$first: '$album.title'},
            description: {$first: '$album.description'},
            image: {$first: '$album.image'},
            release_date: {$first: '$album.release_date'},
            genre: {$first: '$album.genre'},
            artists: {$addToSet: {'_id': '$album.artists._id', 'name': '$album.artists.name', 'description': '$album.artists.description', 'image': '$album.artists.image', 'genre':'$album.artists.genre'}},
            tracks: {$addToSet: {'_id': '$_id', 'name': '$name', 'duration': '$duration', 'file': '$file', 'genre': '$genre', 'artists': '$artists'}},
        })
        .exec()
    }



}
