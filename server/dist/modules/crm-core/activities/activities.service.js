"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ActivitiesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitiesService = void 0;
const common_1 = require("@nestjs/common");
let ActivitiesService = ActivitiesService_1 = class ActivitiesService {
    constructor() {
        this.logger = new common_1.Logger(ActivitiesService_1.name);
    }
    async create(dto, userId) {
    }
    async list(query, userId, userRole) {
    }
    async findById(id, userId, userRole) {
    }
    async update(id, dto, userId, userRole) {
    }
    async complete(id, userId) {
    }
    async delete(id, userId, userRole) {
    }
    async countByDeal(dealId) { return 0; }
    async countPendingByOwner(ownerId) { return 0; }
    async countByStage(stage, from, to) { return 0; }
};
exports.ActivitiesService = ActivitiesService;
exports.ActivitiesService = ActivitiesService = ActivitiesService_1 = __decorate([
    (0, common_1.Injectable)()
], ActivitiesService);
//# sourceMappingURL=activities.service.js.map