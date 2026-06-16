import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { SearchService } from './search.service';

@Controller('search')
@UseGuards(JwtGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(@Query('q') query: string, @Query('limit') limit: number = 10) {
    return this.searchService.search(query, limit);
  }
}