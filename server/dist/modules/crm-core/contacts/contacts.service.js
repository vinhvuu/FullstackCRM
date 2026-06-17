"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ContactsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsService = void 0;
const common_1 = require("@nestjs/common");
let ContactsService = ContactsService_1 = class ContactsService {
    constructor() {
        this.logger = new common_1.Logger(ContactsService_1.name);
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
    async searchForPicker(query, companyId, limit) { return []; }
    async countByCompany(companyId) { return 0; }
};
exports.ContactsService = ContactsService;
exports.ContactsService = ContactsService = ContactsService_1 = __decorate([
    (0, common_1.Injectable)()
], ContactsService);
//# sourceMappingURL=contacts.service.js.map