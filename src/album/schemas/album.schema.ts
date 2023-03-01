import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Artist } from 'src/artist/schemas/artist.schema';

export type AlbumDocument = HydratedDocument<Album>;

@Schema({ timestamps: true })
export class Album {
    
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    image: string;

    @Prop()
    release_date: string;

    @Prop()
    genre: string[];

    // @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' } })
    // @Prop()
    // artists: mongoose.Schema.Types.ObjectId[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }] })
    artists: Artist[];


}

export const AlbumSchema = SchemaFactory.createForClass(Album);