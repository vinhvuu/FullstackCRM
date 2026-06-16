"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.formatDateTime = formatDateTime;
exports.now = now;
const dayjs_1 = require("dayjs");
require("dayjs/locale/vi");
dayjs_1.default.locale('vi');
function formatDate(date) {
    return (0, dayjs_1.default)(date).format('DD/MM/YYYY');
}
function formatDateTime(date) {
    return (0, dayjs_1.default)(date).format('DD/MM/YYYY HH:mm');
}
function now() {
    return new Date();
}
//# sourceMappingURL=date.util.js.map