"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kefuModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const kefuSchema = new mongoose_1.default.Schema({
    account: String,
    pwd: String,
    name: String,
    age: String,
    gender: String,
    nickName: String,
    imgSrc: String
}, { versionKey: false });
exports.kefuModel = mongoose_1.default.model('kefus', kefuSchema);
