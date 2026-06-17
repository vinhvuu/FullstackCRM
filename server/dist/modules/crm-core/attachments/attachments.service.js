"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AttachmentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentsService = void 0;
const common_1 = require("@nestjs/common");
let AttachmentsService = AttachmentsService_1 = class AttachmentsService {
    constructor() {
        this.logger = new common_1.Logger(AttachmentsService_1.name);
    }
    async upload(file, recordType, recordId, userId) {
    }
    async delete(id, userId, userRole) {
    }
    async download(id, userId) {
    }
    async listByRecord(recordType, recordId) { return []; }
};
exports.AttachmentsService = AttachmentsService;
exports.AttachmentsService = AttachmentsService = AttachmentsService_1 = __decorate([
    (0, common_1.Injectable)()
], AttachmentsService);
//# sourceMappingURL=attachments.service.js.map