"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gainRecords = void 0;
const recordModel_1 = require("./models/recordModel");
exports.gainRecords = async (kefu_id, page, limit) => {
    const query = recordModel_1.recordModel.find({ kefu_id });
    const total = await query.countDocuments();
    const data = await query.skip((page - 1) * limit).limit(limit).lean();
    return { data, total };
};
