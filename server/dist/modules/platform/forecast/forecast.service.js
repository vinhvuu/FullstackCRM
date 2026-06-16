"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ForecastService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForecastService = void 0;
const common_1 = require("@nestjs/common");
let ForecastService = ForecastService_1 = class ForecastService {
    constructor() {
        this.logger = new common_1.Logger(ForecastService_1.name);
    }
    async get(periodKey, userId) {
    }
    async createSnapshot(periodKey, userId) {
    }
};
exports.ForecastService = ForecastService;
exports.ForecastService = ForecastService = ForecastService_1 = __decorate([
    (0, common_1.Injectable)()
], ForecastService);
//# sourceMappingURL=forecast.service.js.map