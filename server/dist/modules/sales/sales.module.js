"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesModule = void 0;
const common_1 = require("@nestjs/common");
const deals_module_1 = require("./deals/deals.module");
const deals_controller_1 = require("./deals/deals.controller");
const deals_service_1 = require("./deals/deals.service");
const pipelines_module_1 = require("./pipelines/pipelines.module");
const pipelines_controller_1 = require("./pipelines/pipelines.controller");
const pipelines_service_1 = require("./pipelines/pipelines.service");
const line_items_module_1 = require("./line-items/line-items.module");
const line_items_controller_1 = require("./line-items/line-items.controller");
const line_items_service_1 = require("./line-items/line-items.service");
const products_module_1 = require("./products/products.module");
const products_controller_1 = require("./products/products.controller");
const products_service_1 = require("./products/products.service");
const quotes_module_1 = require("./quotes/quotes.module");
const quotes_controller_1 = require("./quotes/quotes.controller");
const quotes_service_1 = require("./quotes/quotes.service");
const loss_reasons_module_1 = require("./loss-reasons/loss-reasons.module");
const loss_reasons_controller_1 = require("./loss-reasons/loss-reasons.controller");
const loss_reasons_service_1 = require("./loss-reasons/loss-reasons.service");
const convert_module_1 = require("./convert/convert.module");
const convert_controller_1 = require("./convert/convert.controller");
const convert_service_1 = require("./convert/convert.service");
let SalesModule = class SalesModule {
};
exports.SalesModule = SalesModule;
exports.SalesModule = SalesModule = __decorate([
    (0, common_1.Module)({
        imports: [deals_module_1.DealsModule, pipelines_module_1.PipelinesModule, line_items_module_1.LineItemsModule, products_module_1.ProductsModule, quotes_module_1.QuotesModule, loss_reasons_module_1.LossReasonsModule, convert_module_1.ConvertModule],
        controllers: [deals_controller_1.DealsController, pipelines_controller_1.PipelinesController, line_items_controller_1.LineItemsController, products_controller_1.ProductsController, quotes_controller_1.QuotesController, loss_reasons_controller_1.LossReasonsController, convert_controller_1.ConvertController],
        providers: [deals_service_1.DealsService, pipelines_service_1.PipelinesService, line_items_service_1.LineItemsService, products_service_1.ProductsService, quotes_service_1.QuotesService, loss_reasons_service_1.LossReasonsService, convert_service_1.ConvertService]
    })
], SalesModule);
//# sourceMappingURL=sales.module.js.map