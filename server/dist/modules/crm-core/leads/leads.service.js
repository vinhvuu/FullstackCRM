"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LeadsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
let LeadsService = LeadsService_1 = class LeadsService {
    constructor() {
        this.logger = new common_1.Logger(LeadsService_1.name);
    }
    async create(dto, userId) {
    }
    async list(query, userId, userRole) {
    }
    async findById(id, userId, userRole) {
    }
    async update(id, dto, userId, userRole) {
    }
    async delete(id, userId, userRole) {
    }
    async updateStatus(id, dto, userId, userRole) {
    }
    async bulkAction(dto, userId, userRole) {
    }
    async listReminders(leadId) {
    }
    async createReminder(leadId, dto, userId) {
    }
    async updateReminder(leadId, reminderId, dto) {
    }
    async deleteReminder(leadId, reminderId) {
    }
    async previewImport(file) {
    }
    async countByOwner(ownerId) { return 0; }
    async countUnassigned() { return 0; }
    async countInPool() { return 0; }
    async countByStatus(status, ownerId) { return 0; }
    async countBySource(source, ownerId) { return 0; }
    async searchForPicker(query, limit) { return []; }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = LeadsService_1 = __decorate([
    (0, common_1.Injectable)()
], LeadsService);
//# sourceMappingURL=leads.service.js.map