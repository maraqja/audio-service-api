import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/user/enums/user_role.enum';
import { InteractionsService } from './interactions.service';
import { Interaction } from './schemas/interaction.schema';

@Controller('interactions')
export class InteractionsController {



    constructor(private readonly interactionService: InteractionsService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':id/listen')
    async listen(@Param('id') userId: string, @Query() query) {
        return this.interactionService.listenInteraction(userId, query.trackId)

    }


    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get() // Для теста, вызываться не должен нигде, мб в админке только
    async getFavorites() {
        return this.interactionService.agregateFavorites()
    }
}
