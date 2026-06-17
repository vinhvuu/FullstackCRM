import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { EmailTemplatesService, CreateEmailTemplateDto, UpdateEmailTemplateDto } from './email-templates.service';

@Controller('email-templates')
@UseGuards(JwtGuard)
export class EmailTemplatesController {
  constructor(private readonly emailTemplatesService: EmailTemplatesService) {}

  @Get()
  list(@Query() query: any, @CurrentUser() user: any) {
    return this.emailTemplatesService.list(query, user.id, user.role);
  }

  @Post()
  create(@Body() dto: CreateEmailTemplateDto, @CurrentUser() user: any) {
    return this.emailTemplatesService.create(dto, user.id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateEmailTemplateDto, @CurrentUser() user: any) {
    return this.emailTemplatesService.update(id, dto, user.id, user.role);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @CurrentUser() user: any) {
    return this.emailTemplatesService.delete(id, user.id, user.role);
  }
}