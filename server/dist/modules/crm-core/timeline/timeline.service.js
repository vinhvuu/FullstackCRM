"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TimelineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineService = void 0;
const common_1 = require("@nestjs/common");
let TimelineService = TimelineService_1 = class TimelineService {
    constructor() {
        this.logger = new common_1.Logger(TimelineService_1.name);
    }
    async list(query) {
    }
    async create(dto, userId) {
    }
    async getFilters() {
    }
    async add(input) { return {}; }
    async listByRecord(recordType, recordId, type, page, limit) {
        return { data: [], total: 0 };
    }
};
exports.TimelineService = TimelineService;
exports.TimelineService = TimelineService = TimelineService_1 = __decorate([
    (0, common_1.Injectable)()
], TimelineService);
//# sourceMappingURL=timeline.service.js.map