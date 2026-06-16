import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CustomFieldsService, CreateCustomFieldDto, UpdateCustomFieldDto, SetCustomFieldValueDto } from './custom-fields.service';

@Controller('custom-fields')
@UseGuards(JwtGuard)
export class CustomFieldsController {
  constructor(private readonly customFieldsService: CustomFieldsService) {}

  @Get()
  list(@Query() query: any) {
    return this.customFieldsService.list(query);
  }

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateCustomFieldDto) {
    return this.customFieldsService.create(dto);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: number, @Body() dto: UpdateCustomFieldDto) {
    return this.customFieldsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: number) {
    return this.customFieldsService.delete(id);
  }

  @Get('values')
  getValues(@Query() query: any) {
    return this.customFieldsService.getValues(query);
  }

  @Post('values')
  setValues(@Body() dto: SetCustomFieldValueDto, @CurrentUser() user: any) {
    return this.customFieldsService.setValues(dto, user.id);
  }
}