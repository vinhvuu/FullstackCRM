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
exports.SystemSettingsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../../../common/guards/jwt.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const system_settings_service_1 = require("./system-settings.service");
let SystemSettingsController = class SystemSettingsController {
    constructor(systemSettingsService) {
        this.systemSettingsService = systemSettingsService;
    }
    getGeneral() {
        return this.systemSettingsService.getGeneral();
    }
    updateGeneral(dto) {
        return this.systemSettingsService.updateGeneral(dto);
    }
    getSla() {
        return this.systemSettingsService.getSla();
    }
    updateSla(dto) {
        return this.systemSettingsService.updateSla(dto);
    }
};
exports.SystemSettingsController = SystemSettingsController;
__decorate([
    (0, common_1.Get)('general'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SystemSettingsController.prototype, "getGeneral", null);
__decorate([
    (0, common_1.Put)('general'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SystemSettingsController.prototype, "updateGeneral", null);
__decorate([
    (0, common_1.Get)('sla'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SystemSettingsController.prototype, "getSla", null);
__decorate([
    (0, common_1.Put)('sla'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SystemSettingsController.prototype, "updateSla", null);
exports.SystemSettingsController = SystemSettingsController = __decorate([
    (0, common_1.Controller)('system-settings'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:paramtypes", [system_settings_service_1.SystemSettingsService])
], SystemSettingsController);
//# sourceMappingURL=system-settings.controller.js.map