import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  /**
   * T4.34. GET /api/search — Global search (Command Palette)
   * Auth: Authenticated
   * Query: ?q=&limit=10
   */
  async search(query: string, limit: number): Promise<any> {
    // TODO: Dev 4 implement
    // Inject CrmLeadService.searchForPicker(), CrmContactService.searchForPicker(),
    // CrmCompanyService.searchForPicker(), SalesDealService.searchForPicker()
  }
}