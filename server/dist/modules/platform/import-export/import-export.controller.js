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
exports.ImportExportController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../../../common/guards/jwt.guard");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const import_export_service_1 = require("./import-export.service");
let ImportExportController = class ImportExportController {
    constructor(importExportService) {
        this.importExportService = importExportService;
    }
    commitImport(entity, file, dto, user) {
        return this.importExportService.commitImport(entity, file, dto, user.id);
    }
    listBatches(query) {
        return this.importExportService.listBatches(query);
    }
    export(entity, query, user) {
        return this.importExportService.export(entity, query, user.id);
    }
};
exports.ImportExportController = ImportExportController;
__decorate([
    (0, common_1.Post)('import/:entity/commit'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('entity')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], ImportExportController.prototype, "commitImport", null);
__decorate([
    (0, common_1.Get)('batches'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ImportExportController.prototype, "listBatches", null);
__decorate([
    (0, common_1.Get)('export/:entity'),
    __param(0, (0, common_1.Param)('entity')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ImportExportController.prototype, "export", null);
exports.ImportExportController = ImportExportController = __decorate([
    (0, common_1.Controller)('import-export'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:paramtypes", [import_export_service_1.ImportExportService])
], ImportExportController);
//# sourceMappingURL=import-export.controller.js.map