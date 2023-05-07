import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './files/files.module';
import { PlaylistModule } from './playlist/playlist.module';
import { InteractionsModule } from './interactions/interactions.module';
import { RecommenderModule } from './recommender/recommender.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/audio-service'),
    ArtistModule,
    AlbumModule,
    TrackModule,
    UserModule,
    AuthModule,
    FilesModule,
    PlaylistModule,
    InteractionsModule,
    RecommenderModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
