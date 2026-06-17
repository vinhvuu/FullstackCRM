import { Controller, Get, Post, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportExportService, CommitImportDto } from './import-export.service';

@Controller('import-export')
@UseGuards(JwtGuard)
export class ImportExportController {
  constructor(private readonly importExportService: ImportExportService) {}

  @Post('import/:entity/commit')
  @UseInterceptors(FileInterceptor('file'))
  commitImport(
    @Param('entity') entity: string,
    @UploadedFile() file: any,
    @Body() dto: CommitImportDto,
    @CurrentUser() user: any,
  ) {
    return this.importExportService.commitImport(entity, file, dto, user.id);
  }

  @Get('batches')
  listBatches(@Query() query: any) {
    return this.importExportService.listBatches(query);
  }

  @Get('export/:entity')
  export(@Param('entity') entity: string, @Query() query: any, @CurrentUser() user: any) {
    return this.importExportService.export(entity, query, user.id);
  }
}