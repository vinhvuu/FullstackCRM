"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CustomFieldsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomFieldsService = void 0;
const common_1 = require("@nestjs/common");
let CustomFieldsService = CustomFieldsService_1 = class CustomFieldsService {
    constructor() {
        this.logger = new common_1.Logger(CustomFieldsService_1.name);
    }
    async list(query) {
    }
    async create(dto) {
    }
    async update(id, dto) {
    }
    async delete(id) {
    }
    async getValues(query) {
    }
    async setValues(dto, userId) {
    }
    async getDefs(entity) { return []; }
    async validateValues(entity, recordId, values) { return { ok: true, errors: [] }; }
};
exports.CustomFieldsService = CustomFieldsService;
exports.CustomFieldsService = CustomFieldsService = CustomFieldsService_1 = __decorate([
    (0, common_1.Injectable)()
], CustomFieldsService);
//# sourceMappingURL=custom-fields.service.js.map