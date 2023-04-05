import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';
import { Interaction, InteractionSchema } from './schemas/interaction.schema';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Interaction.name, schema: InteractionSchema }]), FilesModule],
  controllers: [InteractionsController],
  providers: [InteractionsService]
})
export class InteractionsModule {}
