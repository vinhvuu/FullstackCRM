"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GoalsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalsService = void 0;
const common_1 = require("@nestjs/common");
let GoalsService = GoalsService_1 = class GoalsService {
    constructor() {
        this.logger = new common_1.Logger(GoalsService_1.name);
    }
    async list(query, userId) {
    }
    async create(dto) {
    }
    async update(id, dto) {
    }
    async delete(id) {
    }
};
exports.GoalsService = GoalsService;
exports.GoalsService = GoalsService = GoalsService_1 = __decorate([
    (0, common_1.Injectable)()
], GoalsService);
//# sourceMappingURL=goals.service.js.map