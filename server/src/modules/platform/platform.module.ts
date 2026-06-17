import { Module } from '@nestjs/common';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsService } from './notifications/notifications.service';
import { SavedViewsModule } from './saved-views/saved-views.module';
import { SavedViewsController } from './saved-views/saved-views.controller';
import { SavedViewsService } from './saved-views/saved-views.service';
import { CustomFieldsModule } from './custom-fields/custom-fields.module';
import { CustomFieldsController } from './custom-fields/custom-fields.controller';
import { CustomFieldsService } from './custom-fields/custom-fields.service';
import { ReportsModule } from './reports/reports.module';
import { ReportsController } from './reports/reports.controller';
import { ReportsService } from './reports/reports.service';
import { GoalsModule } from './goals/goals.module';
import { GoalsController } from './goals/goals.controller';
import { GoalsService } from './goals/goals.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { DashboardController } from './custom-fields/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { ForecastModule } from './forecast/forecast.module';
import { ForecastController } from './forecast/forecast.controller';
import { ForecastService } from './forecast/forecast.service';
import { SystemSettingsModule } from './system-settings/system-settings.module';
import { SystemSettingsController } from './system-settings/system-settings.controller';
import { SystemSettingsService } from './system-settings/system-settings.service';
import { SearchModule } from './search/search.module';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';
import { ImportExportModule } from './import-export/import-export.module';
import { ImportExportController } from './import-export/import-export.controller';
import { ImportExportService } from './import-export/import-export.service';

@Module({
  imports: [NotificationsModule, SavedViewsModule, CustomFieldsModule, ReportsModule, GoalsModule, DashboardModule, ForecastModule, SystemSettingsModule, SearchModule, ImportExportModule],
  controllers: [NotificationsController, SavedViewsController, CustomFieldsController, ReportsController, GoalsController, DashboardController, ForecastController, SystemSettingsController, SearchController, ImportExportController],
  providers: [NotificationsService, SavedViewsService, CustomFieldsService, ReportsService, GoalsService, DashboardService, ForecastService, SystemSettingsService, SearchService, ImportExportService]
})
export class PlatformModule {}
