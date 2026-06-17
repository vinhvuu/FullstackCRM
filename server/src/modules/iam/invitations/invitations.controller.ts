import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { InvitationsService, CreateInvitationsDto } from './invitations.service';

@Controller('invitations')
@UseGuards(JwtGuard)
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Get()
  @Roles('admin')
  list(@Query() query: any) {
    return this.invitationsService.list(query);
  }

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateInvitationsDto) {
    return this.invitationsService.createBatch(dto);
  }

  @Post(':id/revoke')
  @Roles('admin')
  revoke(@Param('id') id: number) {
    return this.invitationsService.revoke(id);
  }

  @Post('accept')
  @Public()
  accept(@Body() dto: any) {
    return this.invitationsService.accept(dto);
  }
}