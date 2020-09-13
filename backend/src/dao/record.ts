import { recordModel } from './models/recordModel'

export const gainRecords = async (
    kefu_id: string,
    page: number,
    limit: number
) => {
    const query = recordModel.find({ kefu_id })
    const total = await query.countDocuments()
    const data = await query.skip((page - 1) * limit).limit(limit).lean()
    return { data, total }
}
