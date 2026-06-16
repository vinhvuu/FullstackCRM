"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EmailTemplatesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplatesService = void 0;
const common_1 = require("@nestjs/common");
let EmailTemplatesService = EmailTemplatesService_1 = class EmailTemplatesService {
    constructor() {
        this.logger = new common_1.Logger(EmailTemplatesService_1.name);
    }
    async list(query, userId, userRole) {
    }
    async create(dto, userId) {
    }
    async update(id, dto, userId, userRole) {
    }
    async delete(id, userId, userRole) {
    }
};
exports.EmailTemplatesService = EmailTemplatesService;
exports.EmailTemplatesService = EmailTemplatesService = EmailTemplatesService_1 = __decorate([
    (0, common_1.Injectable)()
], EmailTemplatesService);
//# sourceMappingURL=email-templates.service.js.map