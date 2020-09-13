import { kefuModel } from './models/kefuModel'

export const gainKefus = async (_id: string, page: number, limit: number) => {
    const query = kefuModel.find({ _id: { $ne: _id } })
}
