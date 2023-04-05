import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from './schemas/track.schema';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]), FilesModule],
  controllers: [TrackController],
  providers: [TrackService]
})
export class TrackModule {}
