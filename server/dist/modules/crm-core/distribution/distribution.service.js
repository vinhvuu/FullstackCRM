"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DistributionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributionService = void 0;
const common_1 = require("@nestjs/common");
let DistributionService = DistributionService_1 = class DistributionService {
    constructor() {
        this.logger = new common_1.Logger(DistributionService_1.name);
    }
    async getSummary() {
    }
    async listAssignable(query) {
    }
    async assign(dto, userId) {
    }
    async applyRules(userId) {
    }
    async listRules(query) {
    }
    async createRule(dto) {
    }
    async updateRule(id, dto) {
    }
    async deleteRule(id) {
    }
    async toggleRule(id) {
    }
    async getPoolConfig() {
    }
    async updatePoolConfig(dto) {
    }
    async getAssignmentHistory(leadId) {
    }
};
exports.DistributionService = DistributionService;
exports.DistributionService = DistributionService = DistributionService_1 = __decorate([
    (0, common_1.Injectable)()
], DistributionService);
//# sourceMappingURL=distribution.service.js.map