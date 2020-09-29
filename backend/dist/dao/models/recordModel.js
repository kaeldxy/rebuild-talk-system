"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const recordSchema = new mongoose_1.default.Schema({
    userInfo: {
        ip: String,
        addr: String,
        os: String
    },
    startTime: Number,
    endTime: Number,
    talkList: [
        {
            sayType: String,
            content: String,
            contentType: String,
            time: Number
        }
    ],
    kefu_id: { type: mongoose_1.default.Types.ObjectId, ref: 'kefus' }
}, { versionKey: false });
exports.recordModel = mongoose_1.default.model('records', recordSchema);
