import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);
  // Reminders are managed via LeadsService (T2.8-T2.11)
}