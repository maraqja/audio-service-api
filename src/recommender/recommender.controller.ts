import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RecommenderService } from './recommender.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('recommender')
export class RecommenderController {

    constructor(private readonly recommenderService: RecommenderService) {}


    @UseGuards(JwtAuthGuard)
    @Get(':id') // get, т.к. нет body
    async getById(@Param('id') id: string) {
        return this.recommenderService.updateAllRecs(id);
    }
}
