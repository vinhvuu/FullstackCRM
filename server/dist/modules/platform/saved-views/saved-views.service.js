"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SavedViewsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedViewsService = void 0;
const common_1 = require("@nestjs/common");
let SavedViewsService = SavedViewsService_1 = class SavedViewsService {
    constructor() {
        this.logger = new common_1.Logger(SavedViewsService_1.name);
    }
    async list(query, userId) {
    }
    async create(dto, userId) {
    }
    async findById(id, userId) {
    }
    async update(id, dto, userId) {
    }
    async delete(id, userId) {
    }
    async applyView(id, userId) { return { filters: {}, columns: [] }; }
};
exports.SavedViewsService = SavedViewsService;
exports.SavedViewsService = SavedViewsService = SavedViewsService_1 = __decorate([
    (0, common_1.Injectable)()
], SavedViewsService);
//# sourceMappingURL=saved-views.service.js.map