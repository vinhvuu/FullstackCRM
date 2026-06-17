"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var InvitationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationsService = void 0;
const common_1 = require("@nestjs/common");
let InvitationsService = InvitationsService_1 = class InvitationsService {
    constructor() {
        this.logger = new common_1.Logger(InvitationsService_1.name);
    }
    async createBatch(dto) {
    }
    async list(query) {
    }
    async revoke(id) {
    }
    async accept(dto) {
    }
};
exports.InvitationsService = InvitationsService;
exports.InvitationsService = InvitationsService = InvitationsService_1 = __decorate([
    (0, common_1.Injectable)()
], InvitationsService);
//# sourceMappingURL=invitations.service.js.map