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
exports.DistributionController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../../../common/guards/jwt.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const distribution_service_1 = require("./distribution.service");
let DistributionController = class DistributionController {
    constructor(distributionService) {
        this.distributionService = distributionService;
    }
    getSummary() {
        return this.distributionService.getSummary();
    }
    listAssignable(query) {
        return this.distributionService.listAssignable(query);
    }
    assign(dto, user) {
        return this.distributionService.assign(dto, user.id);
    }
    applyRules(user) {
        return this.distributionService.applyRules(user.id);
    }
    listRules(query) {
        return this.distributionService.listRules(query);
    }
    createRule(dto) {
        return this.distributionService.createRule(dto);
    }
    updateRule(id, dto) {
        return this.distributionService.updateRule(id, dto);
    }
    deleteRule(id) {
        return this.distributionService.deleteRule(id);
    }
    toggleRule(id) {
        return this.distributionService.toggleRule(id);
    }
    getPoolConfig() {
        return this.distributionService.getPoolConfig();
    }
    updatePoolConfig(dto) {
        return this.distributionService.updatePoolConfig(dto);
    }
};
exports.DistributionController = DistributionController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DistributionController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('assignable'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DistributionController.prototype, "listAssignable", null);
__decorate([
    (0, common_1.Post)('assign'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DistributionController.prototype, "assign", null);
__decorate([
    (0, common_1.Post)('apply-rules'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DistributionController.prototype, "applyRules", null);
__decorate([
    (0, common_1.Get)('rules'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DistributionController.prototype, "listRules", null);
__decorate([
    (0, common_1.Post)('rules'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DistributionController.prototype, "createRule", null);
__decorate([
    (0, common_1.Put)('rules/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], DistributionController.prototype, "updateRule", null);
__decorate([
    (0, common_1.Delete)('rules/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DistributionController.prototype, "deleteRule", null);
__decorate([
    (0, common_1.Post)('rules/:id/toggle'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DistributionController.prototype, "toggleRule", null);
__decorate([
    (0, common_1.Get)('pool-config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DistributionController.prototype, "getPoolConfig", null);
__decorate([
    (0, common_1.Put)('pool-config'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DistributionController.prototype, "updatePoolConfig", null);
exports.DistributionController = DistributionController = __decorate([
    (0, common_1.Controller)('distribution'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:paramtypes", [distribution_service_1.DistributionService])
], DistributionController);
//# sourceMappingURL=distribution.controller.js.map