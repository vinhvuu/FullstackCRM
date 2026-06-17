"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IamModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const auth_controller_1 = require("./auth/auth.controller");
const auth_service_1 = require("./auth/auth.service");
const users_module_1 = require("./users/users.module");
const users_controller_1 = require("./users/users.controller");
const users_service_1 = require("./users/users.service");
const invitations_module_1 = require("./invitations/invitations.module");
const invitations_controller_1 = require("./invitations/invitations.controller");
const invitations_service_1 = require("./invitations/invitations.service");
const audit_module_1 = require("./audit/audit.module");
const audit_controller_1 = require("./audit/audit.controller");
const audit_service_1 = require("./audit/audit.service");
const prefs_module_1 = require("./prefs/prefs.module");
const prefs_controller_1 = require("./prefs/prefs.controller");
const prefs_service_1 = require("./prefs/prefs.service");
let IamModule = class IamModule {
};
exports.IamModule = IamModule;
exports.IamModule = IamModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, users_module_1.UsersModule, invitations_module_1.InvitationsModule, audit_module_1.AuditModule, prefs_module_1.PrefsModule],
        controllers: [auth_controller_1.AuthController, users_controller_1.UsersController, invitations_controller_1.InvitationsController, audit_controller_1.AuditController, prefs_controller_1.PrefsController],
        providers: [auth_service_1.AuthService, users_service_1.UsersService, invitations_service_1.InvitationsService, audit_service_1.AuditService, prefs_service_1.PrefsService]
    })
], IamModule);
//# sourceMappingURL=iam.module.js.map