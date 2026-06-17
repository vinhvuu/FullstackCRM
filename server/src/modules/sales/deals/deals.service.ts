import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IsNull,
  Repository,
} from 'typeorm';

import { SalesDeal } from '../database/entities/deal.entity';

@Injectable()
export class DealsService {
  private readonly logger =
    new Logger(DealsService.name);

  constructor(
    @InjectRepository(SalesDeal)
    private readonly dealRepo: Repository<SalesDeal>,
  ) {}
