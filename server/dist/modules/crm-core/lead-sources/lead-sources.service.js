"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LeadSourcesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadSourcesService = void 0;
const common_1 = require("@nestjs/common");
let LeadSourcesService = LeadSourcesService_1 = class LeadSourcesService {
    constructor() {
        this.logger = new common_1.Logger(LeadSourcesService_1.name);
    }
    async list() {
    }
    async create(dto) {
    }
    async update(id, dto) {
    }
    async delete(id) {
    }
};
exports.LeadSourcesService = LeadSourcesService;
exports.LeadSourcesService = LeadSourcesService = LeadSourcesService_1 = __decorate([
    (0, common_1.Injectable)()
], LeadSourcesService);
//# sourceMappingURL=lead-sources.service.js.map