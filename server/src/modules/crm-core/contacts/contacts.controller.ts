import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ContactsService, CreateContactDto, UpdateContactDto } from './contacts.service';

@Controller('contacts')
@UseGuards(JwtGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(@Body() dto: CreateContactDto, @CurrentUser() user: any) {
    return this.contactsService.create(dto, user.id);
  }

  @Get()
  list(@Query() query: any, @CurrentUser() user: any) {
    return this.contactsService.list(query, user.id, user.role);
  }

  @Get(':id')
  findById(@Param('id') id: number, @CurrentUser() user: any) {
    return this.contactsService.findById(id, user.id, user.role);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateContactDto, @CurrentUser() user: any) {
    return this.contactsService.update(id, dto, user.id, user.role);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @CurrentUser() user: any) {
    return this.contactsService.delete(id, user.id, user.role);
  }
}