import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { PrefsService, UpdateUserPrefsDto } from './prefs.service';

@Controller('users/me/prefs')
@UseGuards(JwtGuard)
export class PrefsController {
  constructor(private readonly prefsService: PrefsService) {}

  @Get()
  get(@CurrentUser() user: any) {
    return this.prefsService.get(user.id);
  }

  @Put()
  update(@CurrentUser() user: any, @Body() dto: UpdateUserPrefsDto) {
    return this.prefsService.update(user.id, dto);
  }
}