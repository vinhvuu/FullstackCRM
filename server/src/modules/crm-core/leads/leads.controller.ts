import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { LeadsService, CreateLeadDto, UpdateLeadDto, UpdateLeadStatusDto, BulkLeadActionDto, CreateReminderDto, UpdateReminderDto } from './leads.service';

@Controller('leads')
@UseGuards(JwtGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Body() dto: CreateLeadDto, @CurrentUser() user: any) {
    return this.leadsService.create(dto, user.id);
  }

  @Get()
  list(@Query() query: any, @CurrentUser() user: any) {
    return this.leadsService.list(query, user.id, user.role);
  }

  @Get(':id')
  findById(@Param('id') id: number, @CurrentUser() user: any) {
    return this.leadsService.findById(id, user.id, user.role);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateLeadDto, @CurrentUser() user: any) {
    return this.leadsService.update(id, dto, user.id, user.role);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @CurrentUser() user: any) {
    return this.leadsService.delete(id, user.id, user.role);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: number, @Body() dto: UpdateLeadStatusDto, @CurrentUser() user: any) {
    return this.leadsService.updateStatus(id, dto, user.id, user.role);
  }

  @Post('bulk')
  bulkAction(@Body() dto: BulkLeadActionDto, @CurrentUser() user: any) {
    return this.leadsService.bulkAction(dto, user.id, user.role);
  }

  @Get(':id/reminders')
  listReminders(@Param('id') leadId: number) {
    return this.leadsService.listReminders(leadId);
  }

  @Post(':id/reminders')
  createReminder(@Param('id') leadId: number, @Body() dto: CreateReminderDto, @CurrentUser() user: any) {
    return this.leadsService.createReminder(leadId, dto, user.id);
  }

  @Put(':id/reminders/:reminderId')
  updateReminder(@Param('id') leadId: number, @Param('reminderId') reminderId: number, @Body() dto: UpdateReminderDto) {
    return this.leadsService.updateReminder(leadId, reminderId, dto);
  }

  @Delete(':id/reminders/:reminderId')
  deleteReminder(@Param('id') leadId: number, @Param('reminderId') reminderId: number) {
    return this.leadsService.deleteReminder(leadId, reminderId);
  }

  @Post('import/preview')
  @UseInterceptors(FileInterceptor('file'))
  previewImport(@UploadedFile() file: any) {
    return this.leadsService.previewImport(file);
  }
}