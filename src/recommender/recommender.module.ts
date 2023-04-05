import { Module } from '@nestjs/common';
import { RecommenderController } from './recommender.controller';
import { RecommenderService } from './recommender.service';
import { HttpModule } from '@nestjs/axios';
import { PlaylistModule } from 'src/playlist/playlist.module';

@Module({
  imports: [HttpModule, PlaylistModule],
  controllers: [RecommenderController],
  providers: [RecommenderService]
})
export class RecommenderModule {}
