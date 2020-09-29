"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gainKefus = void 0;
const kefuModel_1 = require("./models/kefuModel");
exports.gainKefus = async (_id, page, limit) => {
    const query = kefuModel_1.kefuModel.find({ _id: { $ne: _id } });
    const total = await query.countDocuments();
    const data = await query
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    return { data, total };
};
