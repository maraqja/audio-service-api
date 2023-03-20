import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Album } from 'src/album/schemas/album.schema';

export type TrackDocument = HydratedDocument<Track>;

@Schema({ timestamps: true })
export class Track {
    
    @Prop()
    name: string;

    @Prop()
    duration: number;

    @Prop()
    file: string;

    @Prop()
    genre: string[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Album' })
    album: Album;

    @Prop()
    key: string;

    @Prop()
    bpm: number;


}

export const TrackSchema = SchemaFactory.createForClass(Track);