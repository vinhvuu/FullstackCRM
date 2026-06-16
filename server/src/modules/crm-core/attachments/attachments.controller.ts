import { Controller, Post, Delete, Get, Param, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachmentsService } from './attachments.service';

@Controller('attachments')
@UseGuards(JwtGuard)
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: any, @Body() body: any, @CurrentUser() user: any) {
    return this.attachmentsService.upload(file, body.recordType, parseInt(body.recordId), user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @CurrentUser() user: any) {
    return this.attachmentsService.delete(id, user.id, user.role);
  }

  @Get(':id/download')
  download(@Param('id') id: number, @CurrentUser() user: any) {
    return this.attachmentsService.download(id, user.id);
  }
}