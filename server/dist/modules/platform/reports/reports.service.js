"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ReportsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
let ReportsService = ReportsService_1 = class ReportsService {
    constructor() {
        this.logger = new common_1.Logger(ReportsService_1.name);
    }
    async listPresets() {
    }
    async listDefs(query, userId) {
    }
    async createDef(dto, userId) {
    }
    async run(dto, userId) {
    }
    async drilldown(dto, userId) {
    }
    async deleteDef(id, userId) {
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = ReportsService_1 = __decorate([
    (0, common_1.Injectable)()
], ReportsService);
//# sourceMappingURL=reports.service.js.map