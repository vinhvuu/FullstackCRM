import { Module } from '@nestjs/common';
import { LeadsModule } from './leads/leads.module';
import { LeadsController } from './leads/leads.controller';
import { LeadsService } from './leads/leads.service';
import { ContactsModule } from './contacts/contacts.module';
import { ContactsController } from './contacts/contacts.controller';
import { ContactsService } from './contacts/contacts.service';
import { CompaniesModule } from './companies/companies.module';
import { CompaniesController } from './companies/companies.controller';
import { CompaniesService } from './companies/companies.service';
import { TagsModule } from './tags/tags.module';
import { TagsController } from './tags/tags.controller';
import { TagsService } from './tags/tags.service';
import { LeadSourcesModule } from './lead-sources/lead-sources.module';
import { LeadSourcesController } from './lead-sources/lead-sources.controller';
import { LeadSourcesService } from './lead-sources/lead-sources.service';
import { RemindersModule } from './reminders/reminders.module';
import { RemindersController } from './reminders/reminders.controller';
import { RemindersService } from './reminders/reminders.service';
import { ActivitiesModule } from './activities/activities.module';
import { ActivitiesController } from './activities/activities.controller';
import { ActivitiesService } from './activities/activities.service';
import { TimelineModule } from './timeline/timeline.module';
import { TimelineController } from './timeline/timeline.controller';
import { TimelineService } from './timeline/timeline.service';
import { AttachmentsModule } from './attachments/attachments.module';
import { AttachmentsController } from './attachments/attachments.controller';
import { AttachmentsService } from './attachments/attachments.service';
import { EmailTemplatesModule } from './email-templates/email-templates.module';
import { EmailTemplatesController } from './email-templates/email-templates.controller';
import { EmailTemplatesService } from './email-templates/email-templates.service';
import { DistributionModule } from './distribution/distribution.module';
import { DistributionController } from './distribution/distribution.controller';
import { DistributionService } from './distribution/distribution.service';

@Module({
  imports: [LeadsModule, ContactsModule, CompaniesModule, TagsModule, LeadSourcesModule, RemindersModule, ActivitiesModule, TimelineModule, AttachmentsModule, EmailTemplatesModule, DistributionModule],
  controllers: [LeadsController, ContactsController, CompaniesController, TagsController, LeadSourcesController, RemindersController, ActivitiesController, TimelineController, AttachmentsController, EmailTemplatesController, DistributionController],
  providers: [LeadsService, ContactsService, CompaniesService, TagsService, LeadSourcesService, RemindersService, ActivitiesService, TimelineService, AttachmentsService, EmailTemplatesService, DistributionService]
})
export class CrmCoreModule {}
