"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordRouter = void 0;
const express_1 = __importDefault(require("express"));
const record_1 = require("../dao/record");
exports.recordRouter = express_1.default
    .Router()
    .get('/', async (req, res, next) => {
    let { page, limit, kefu_id } = req.query;
    page = ~~page;
    limit = ~~limit;
    const { data, total } = await record_1.gainRecords(kefu_id, page, limit);
    res.send({
        data,
        total,
        status: true,
        msg: ''
    });
})
    .post('login', (req, res, next) => { });
