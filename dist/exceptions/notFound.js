"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("./http"));
class NotFoundException extends http_1.default {
    constructor() {
        super(404, `Not found`);
    }
}
exports.default = NotFoundException;
