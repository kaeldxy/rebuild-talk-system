"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kefuRouter = void 0;
const express_1 = __importDefault(require("express"));
const kefu_1 = require("../dao/kefu");
exports.kefuRouter = express_1.default
    .Router()
    .get('/', async (req, res, next) => {
    let { page, limit, _id } = req.query;
    page = ~~page;
    limit = ~~limit;
    const { data, total } = await kefu_1.gainKefus(_id, page, limit);
    res.send({
        data,
        total,
        status: true,
        msg: ''
    });
})
    .post('login', (req, res, next) => { });
