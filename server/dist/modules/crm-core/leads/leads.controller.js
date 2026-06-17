"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../../../common/guards/jwt.guard");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const leads_service_1 = require("./leads.service");
let LeadsController = class LeadsController {
    constructor(leadsService) {
        this.leadsService = leadsService;
    }
    create(dto, user) {
        return this.leadsService.create(dto, user.id);
    }
    list(query, user) {
        return this.leadsService.list(query, user.id, user.role);
    }
    findById(id, user) {
        return this.leadsService.findById(id, user.id, user.role);
    }
    update(id, dto, user) {
        return this.leadsService.update(id, dto, user.id, user.role);
    }
    delete(id, user) {
        return this.leadsService.delete(id, user.id, user.role);
    }
    updateStatus(id, dto, user) {
        return this.leadsService.updateStatus(id, dto, user.id, user.role);
    }
    bulkAction(dto, user) {
        return this.leadsService.bulkAction(dto, user.id, user.role);
    }
    listReminders(leadId) {
        return this.leadsService.listReminders(leadId);
    }
    createReminder(leadId, dto, user) {
        return this.leadsService.createReminder(leadId, dto, user.id);
    }
    updateReminder(leadId, reminderId, dto) {
        return this.leadsService.updateReminder(leadId, reminderId, dto);
    }
    deleteReminder(leadId, reminderId) {
        return this.leadsService.deleteReminder(leadId, reminderId);
    }
    previewImport(file) {
        return this.leadsService.previewImport(file);
    }
};
exports.LeadsController = LeadsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "delete", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "bulkAction", null);
__decorate([
    (0, common_1.Get)(':id/reminders'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "listReminders", null);
__decorate([
    (0, common_1.Post)(':id/reminders'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "createReminder", null);
__decorate([
    (0, common_1.Put)(':id/reminders/:reminderId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('reminderId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "updateReminder", null);
__decorate([
    (0, common_1.Delete)(':id/reminders/:reminderId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('reminderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "deleteReminder", null);
__decorate([
    (0, common_1.Post)('import/preview'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "previewImport", null);
exports.LeadsController = LeadsController = __decorate([
    (0, common_1.Controller)('leads'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:paramtypes", [leads_service_1.LeadsService])
], LeadsController);
//# sourceMappingURL=leads.controller.js.map