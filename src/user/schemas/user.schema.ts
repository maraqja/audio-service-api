import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Track } from 'src/track/schemas/track.schema';
import { Role } from '../enums/user_role.enum';

export type UserDocument = HydratedDocument<User>;


class UserPreferences {

    @Prop()
    genre: string[];

    @Prop()
    artist: string[];

}



@Schema({ timestamps: true })
export class User {
    
    @Prop({ unique: true })
    username: string;

    @Prop({ unique: true })
    email: string;

    @Prop()
    passwordHash: string;

    @Prop()
    image: string;

    @Prop()
    role: Role[]

    @Prop()
    preferences: UserPreferences;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }] })
    favoriteTracks: Track[];


}

export const UserSchema = SchemaFactory.createForClass(User);