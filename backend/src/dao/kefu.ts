import { Ikefu } from 'MyType'
import { kefuModel } from './models/kefuModel'

export const gainKefus = async (_id: string, page: number, limit: number) => {
    const query = kefuModel.find({ _id: { $ne: _id } })
    const total = await query.countDocuments()
    const data = await query
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
    return { data, total }
}
