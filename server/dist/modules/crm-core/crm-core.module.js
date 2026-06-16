"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmCoreModule = void 0;
const common_1 = require("@nestjs/common");
const leads_module_1 = require("./leads/leads.module");
const leads_controller_1 = require("./leads/leads.controller");
const leads_service_1 = require("./leads/leads.service");
const contacts_module_1 = require("./contacts/contacts.module");
const contacts_controller_1 = require("./contacts/contacts.controller");
const contacts_service_1 = require("./contacts/contacts.service");
const companies_module_1 = require("./companies/companies.module");
const companies_controller_1 = require("./companies/companies.controller");
const companies_service_1 = require("./companies/companies.service");
const tags_module_1 = require("./tags/tags.module");
const tags_controller_1 = require("./tags/tags.controller");
const tags_service_1 = require("./tags/tags.service");
const lead_sources_module_1 = require("./lead-sources/lead-sources.module");
const lead_sources_controller_1 = require("./lead-sources/lead-sources.controller");
const lead_sources_service_1 = require("./lead-sources/lead-sources.service");
const reminders_module_1 = require("./reminders/reminders.module");
const reminders_controller_1 = require("./reminders/reminders.controller");
const reminders_service_1 = require("./reminders/reminders.service");
const activities_module_1 = require("./activities/activities.module");
const activities_controller_1 = require("./activities/activities.controller");
const activities_service_1 = require("./activities/activities.service");
const timeline_module_1 = require("./timeline/timeline.module");
const timeline_controller_1 = require("./timeline/timeline.controller");
const timeline_service_1 = require("./timeline/timeline.service");
const attachments_module_1 = require("./attachments/attachments.module");
const attachments_controller_1 = require("./attachments/attachments.controller");
const attachments_service_1 = require("./attachments/attachments.service");
const email_templates_module_1 = require("./email-templates/email-templates.module");
const email_templates_controller_1 = require("./email-templates/email-templates.controller");
const email_templates_service_1 = require("./email-templates/email-templates.service");
const distribution_module_1 = require("./distribution/distribution.module");
const distribution_controller_1 = require("./distribution/distribution.controller");
const distribution_service_1 = require("./distribution/distribution.service");
let CrmCoreModule = class CrmCoreModule {
};
exports.CrmCoreModule = CrmCoreModule;
exports.CrmCoreModule = CrmCoreModule = __decorate([
    (0, common_1.Module)({
        imports: [leads_module_1.LeadsModule, contacts_module_1.ContactsModule, companies_module_1.CompaniesModule, tags_module_1.TagsModule, lead_sources_module_1.LeadSourcesModule, reminders_module_1.RemindersModule, activities_module_1.ActivitiesModule, timeline_module_1.TimelineModule, attachments_module_1.AttachmentsModule, email_templates_module_1.EmailTemplatesModule, distribution_module_1.DistributionModule],
        controllers: [leads_controller_1.LeadsController, contacts_controller_1.ContactsController, companies_controller_1.CompaniesController, tags_controller_1.TagsController, lead_sources_controller_1.LeadSourcesController, reminders_controller_1.RemindersController, activities_controller_1.ActivitiesController, timeline_controller_1.TimelineController, attachments_controller_1.AttachmentsController, email_templates_controller_1.EmailTemplatesController, distribution_controller_1.DistributionController],
        providers: [leads_service_1.LeadsService, contacts_service_1.ContactsService, companies_service_1.CompaniesService, tags_service_1.TagsService, lead_sources_service_1.LeadSourcesService, reminders_service_1.RemindersService, activities_service_1.ActivitiesService, timeline_service_1.TimelineService, attachments_service_1.AttachmentsService, email_templates_service_1.EmailTemplatesService, distribution_service_1.DistributionService]
    })
], CrmCoreModule);
//# sourceMappingURL=crm-core.module.js.map