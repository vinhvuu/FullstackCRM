"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var QuotesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotesService = void 0;
const common_1 = require("@nestjs/common");
let QuotesService = QuotesService_1 = class QuotesService {
    constructor() {
        this.logger = new common_1.Logger(QuotesService_1.name);
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
    async send(id, userId) {
    }
    async accept(id, userId) {
    }
    async reject(id, dto, userId) {
    }
    async countByOwner(ownerId) { return 0; }
    async sumAcceptedTotal(from, to) { return 0; }
};
exports.QuotesService = QuotesService;
exports.QuotesService = QuotesService = QuotesService_1 = __decorate([
    (0, common_1.Injectable)()
], QuotesService);
//# sourceMappingURL=quotes.service.js.map