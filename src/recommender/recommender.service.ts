import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { PlaylistService } from 'src/playlist/playlist.service';
import { PlaylistSource } from 'src/playlist/schemas/playlist.schema';

const recApiUrl = 'http://127.0.0.1:5000'
const playlistImage = '/uploads/image/default.jpg'

@Injectable()
export class RecommenderService {


    constructor(
        private readonly httpService: HttpService,
        private readonly playlistService: PlaylistService
        ) {}


    async createPopularRecs(userId: string) { // создаем плейлист популярного (популярные треки, которые не слушал юзер), получая идентификаторы рекомендуемых треков с сервера
        return this.httpService.axiosRef.get(`${recApiUrl}/popularity_recs/${userId}`).then((popRecs) => {
            const typeOfRecommender = 'Popularity Recomendations'
            return this.playlistService.updateRecPlaylist(userId, typeOfRecommender, {
            name: typeOfRecommender,
            description: 'В этом плейлисте собраны наиболее популярные треки, которые могли бы быть вам интересны',
            image: playlistImage,
            source: PlaylistSource.Recommender,
            tracks: popRecs.data,
            owner: userId
        })
        })
    }


    async createCBRecs(userId: string) { // создаем плейлист content-based recs, получая идентификаторы рекомендуемых треков с сервера
        return this.httpService.axiosRef.get(`${recApiUrl}/cb_recs/${userId}`).then((cbRecs) => {
            const typeOfRecommender = 'Content-Based Recomendations'
            return this.playlistService.updateRecPlaylist(userId, typeOfRecommender, {
            name: typeOfRecommender,
            description: 'В этом плейлисте собраны треки, похожие на те, с которыми вы чаще всего взаимодействовали',
            image: playlistImage,
            source: PlaylistSource.Recommender,
            tracks: cbRecs.data,
            owner: userId
        })
        })
    }


    async createCFRecs(userId: string) { // создаем плейлист content-based recs, получая идентификаторы рекомендуемых треков с сервера
        return this.httpService.axiosRef.get(`${recApiUrl}/cf_recs/${userId}`).then((cfRecs) => {
            const typeOfRecommender = 'Collaborative Filtering Recomendations'
            return this.playlistService.updateRecPlaylist(userId, typeOfRecommender, {
            name: typeOfRecommender,
            description: 'В этом плейлисте собраны треки, интересные пользователям со схожими интересами',
            image: playlistImage,
            source: PlaylistSource.Recommender,
            tracks: cfRecs.data,
            owner: userId
        })
        })
    }


    async createHybridRecs(userId: string) { // создаем плейлист content-based recs, получая идентификаторы рекомендуемых треков с сервера
        return this.httpService.axiosRef.get(`${recApiUrl}/hybrid_recs/${userId}`).then((hybridRecs) => {
            const typeOfRecommender = 'Hybrid Recomendations'
            return this.playlistService.updateRecPlaylist(userId, typeOfRecommender, {
            name: typeOfRecommender,
            description: 'В этом плейлисте собраны треки, рекомендуемые совместно взвешенными моделями фильтрации на основе контента и совместной фильтрации (для достижения лучшего качества рекомендаций)',
            image: playlistImage,
            source: PlaylistSource.Recommender,
            tracks: hybridRecs.data,
            owner: userId
        })
        })
    }


    async updateAllRecs(userId: string) { // создаем все 4 плейлиста
        return await Promise.all([this.createPopularRecs(userId), this.createCBRecs(userId), this.createCFRecs(userId), this.createHybridRecs(userId)]) // чтобы выполнились все
    }



    

}
