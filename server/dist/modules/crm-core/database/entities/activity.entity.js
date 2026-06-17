"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmActivity = void 0;
const typeorm_1 = require("typeorm");
let CrmActivity = class CrmActivity {
};
exports.CrmActivity = CrmActivity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", Number)
], CrmActivity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", Number)
], CrmActivity.prototype, "owner_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['call', 'email', 'meeting', 'task'] }),
    __metadata("design:type", String)
], CrmActivity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], CrmActivity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CrmActivity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], CrmActivity.prototype, "lead_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], CrmActivity.prototype, "contact_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], CrmActivity.prototype, "company_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], CrmActivity.prototype, "deal_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['lead', 'contact', 'company', 'deal', 'quote'], nullable: true }),
    __metadata("design:type", Object)
], CrmActivity.prototype, "related_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], CrmActivity.prototype, "related_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], CrmActivity.prototype, "due_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], CrmActivity.prototype, "remind_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['pending', 'completed', 'overdue'], default: 'pending' }),
    __metadata("design:type", String)
], CrmActivity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['high', 'medium', 'low'], nullable: true }),
    __metadata("design:type", Object)
], CrmActivity.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], CrmActivity.prototype, "completed_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CrmActivity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CrmActivity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], CrmActivity.prototype, "deleted_at", void 0);
exports.CrmActivity = CrmActivity = __decorate([
    (0, typeorm_1.Entity)('crm_activities')
], CrmActivity);
//# sourceMappingURL=activity.entity.js.map