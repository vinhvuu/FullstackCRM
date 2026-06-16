"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DealsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealsService = void 0;
const common_1 = require("@nestjs/common");
let DealsService = DealsService_1 = class DealsService {
    constructor() {
        this.logger = new common_1.Logger(DealsService_1.name);
    }
    async create(dto, userId) {
    }
    async list(query, userId, userRole) {
    }
    async getBoard(query, userId, userRole) {
    }
    async findById(id, userId, userRole) {
    }
    async update(id, dto, userId, userRole) {
    }
    async delete(id, userId, userRole) {
    }
    async updateStage(id, dto, userId) {
    }
    async markWon(id, userId) {
    }
    async markLost(id, dto, userId) {
    }
    async searchForPicker(query, limit) { return []; }
    async countOpenByOwner(ownerId) { return 0; }
    async countOpenByCompany(companyId) { return 0; }
    async sumOpenValueByCompany(companyId) { return 0; }
    async countByStage(stage, from, to, ownerId) { return 0; }
    async sumWonValue(from, to, ownerId) { return 0; }
    async weightedValue(from, to, ownerId) { return 0; }
    async groupBySource(from, to, ownerId) { return []; }
    async groupByStage(from, to, ownerId) { return []; }
    async groupByMonth(from, to, ownerId) { return []; }
    async winRate(from, to, ownerId) { return 0; }
    async revenueByOwnerInPeriod(ownerId, periodKey) { return 0; }
    async dealsWonByOwnerInPeriod(ownerId, periodKey) { return 0; }
    async forecastBuckets(periodKey, ownerId) { return { committed: 0, best_case: 0, pipeline: 0 }; }
};
exports.DealsService = DealsService;
exports.DealsService = DealsService = DealsService_1 = __decorate([
    (0, common_1.Injectable)()
], DealsService);
//# sourceMappingURL=deals.service.js.map