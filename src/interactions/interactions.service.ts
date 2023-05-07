import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Interaction, InteractionDocument } from './schemas/interaction.schema';
import { FilesService } from 'src/files/files.service';
import { Cron, Interval } from '@nestjs/schedule';

@Injectable()
export class InteractionsService {


    constructor(
        @InjectModel(Interaction.name) private interactionModel: Model<InteractionDocument>,
        private readonly fileService: FilesService
        ) {}

    async listenInteraction (userId: string, trackId: string) {
        return this.interactionModel.findOneAndUpdate(
            { userId, trackId },
            { $inc: { countListens:1 }},
            { new:true, upsert: true }
        )
    }


    // метод для рекомендашки
    // @Cron('45 * * * *') // каждую минуту на 45 секунде
    @Interval(5000) // каждые 5 сек
    async agregateFavorites() { // надо бы каэш затипизировать
        console.log('saving user-interactions.json ...')
        // Почему-то при чейнинге в ответе выдавало белую страницу, заюзал обычный способ
        // return this.interactionModel.aggregate().lookup({
        //     from: 'users',
        //     localField: 'userId',
        //     foreignField: '_id',
        //     as: 'userId'
        // })
        // .exec
        return this.interactionModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user_info'
                }
            },
            {
                $unwind: "$user_info" // убираем вид массива
            },
            {
                $addFields: {
                    isFavorite: 
                    {   
                        $cond: // проверка на то, что id прослушанного трека включено в массив треков, которые пользователь добавил в избранное
                        { if: { $in: [ "$trackId", "$user_info.favoriteTracks" ] }, then: true, else: false } 
                    }
                }
            },
            {
                $project: {trackId: 1, userId: 1, isFavorite: 1, countListens: 1} // выбираем нужны поля
            },
        ])
        .exec().then( (data) => {
            // console.log(data)
            return this.fileService.saveJson('user-interactions.json', data)
        } )



        
    }

}
