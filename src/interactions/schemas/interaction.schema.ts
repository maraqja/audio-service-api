import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Track } from 'src/track/schemas/track.schema';
import { User } from 'src/user/schemas/user.schema';


export type InteractionDocument = HydratedDocument<Interaction>;

@Schema({ timestamps: true })
export class Interaction {
    
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    userId: User;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }] })
    trackId: Track;

    @Prop()
    countListens: number;


}

export const InteractionSchema = SchemaFactory.createForClass(Interaction);