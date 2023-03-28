import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Album } from 'src/album/schemas/album.schema';
import { Track } from 'src/track/schemas/track.schema';
import { User } from 'src/user/schemas/user.schema';

export type PlaylistDocument = HydratedDocument<Playlist>;


export enum PlaylistSource {
    Recommender = 'recommender',
    Admin = 'admin',
    User = 'user'
    
}

@Schema({ timestamps: true })
export class Playlist {
    
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    image: string;

    @Prop()
    source: PlaylistSource; // поле, определяющее источник создания плейлиста

    @Prop({ type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Track'}] })
    tracks: Track[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    owner?: User; // необязательное поле, определяющее владельца плейлиста, если source = user, пользователя, которому следует отобразить плейлист, если source = recommender 

}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);