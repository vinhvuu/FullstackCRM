"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformModule = void 0;
const common_1 = require("@nestjs/common");
const notifications_module_1 = require("./notifications/notifications.module");
const notifications_controller_1 = require("./notifications/notifications.controller");
const notifications_service_1 = require("./notifications/notifications.service");
const saved_views_module_1 = require("./saved-views/saved-views.module");
const saved_views_controller_1 = require("./saved-views/saved-views.controller");
const saved_views_service_1 = require("./saved-views/saved-views.service");
const custom_fields_module_1 = require("./custom-fields/custom-fields.module");
const custom_fields_controller_1 = require("./custom-fields/custom-fields.controller");
const custom_fields_service_1 = require("./custom-fields/custom-fields.service");
const reports_module_1 = require("./reports/reports.module");
const reports_controller_1 = require("./reports/reports.controller");
const reports_service_1 = require("./reports/reports.service");
const goals_module_1 = require("./goals/goals.module");
const goals_controller_1 = require("./goals/goals.controller");
const goals_service_1 = require("./goals/goals.service");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const dashboard_controller_1 = require("./custom-fields/dashboard.controller");
const dashboard_service_1 = require("./dashboard/dashboard.service");
const forecast_module_1 = require("./forecast/forecast.module");
const forecast_controller_1 = require("./forecast/forecast.controller");
const forecast_service_1 = require("./forecast/forecast.service");
const system_settings_module_1 = require("./system-settings/system-settings.module");
const system_settings_controller_1 = require("./system-settings/system-settings.controller");
const system_settings_service_1 = require("./system-settings/system-settings.service");
const search_module_1 = require("./search/search.module");
const search_controller_1 = require("./search/search.controller");
const search_service_1 = require("./search/search.service");
const import_export_module_1 = require("./import-export/import-export.module");
const import_export_controller_1 = require("./import-export/import-export.controller");
const import_export_service_1 = require("./import-export/import-export.service");
let PlatformModule = class PlatformModule {
};
exports.PlatformModule = PlatformModule;
exports.PlatformModule = PlatformModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule, saved_views_module_1.SavedViewsModule, custom_fields_module_1.CustomFieldsModule, reports_module_1.ReportsModule, goals_module_1.GoalsModule, dashboard_module_1.DashboardModule, forecast_module_1.ForecastModule, system_settings_module_1.SystemSettingsModule, search_module_1.SearchModule, import_export_module_1.ImportExportModule],
        controllers: [notifications_controller_1.NotificationsController, saved_views_controller_1.SavedViewsController, custom_fields_controller_1.CustomFieldsController, reports_controller_1.ReportsController, goals_controller_1.GoalsController, dashboard_controller_1.DashboardController, forecast_controller_1.ForecastController, system_settings_controller_1.SystemSettingsController, search_controller_1.SearchController, import_export_controller_1.ImportExportController],
        providers: [notifications_service_1.NotificationsService, saved_views_service_1.SavedViewsService, custom_fields_service_1.CustomFieldsService, reports_service_1.ReportsService, goals_service_1.GoalsService, dashboard_service_1.DashboardService, forecast_service_1.ForecastService, system_settings_service_1.SystemSettingsService, search_service_1.SearchService, import_export_service_1.ImportExportService]
    })
], PlatformModule);
//# sourceMappingURL=platform.module.js.map