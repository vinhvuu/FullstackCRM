import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';

@Controller('reminders')
@UseGuards(JwtGuard)
export class RemindersController {
  constructor() {}
}