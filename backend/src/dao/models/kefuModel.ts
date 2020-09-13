import mongoose from 'mongoose'
import { IkefuModel } from 'MyType'
const kefuSchema = new mongoose.Schema<IkefuModel>(
    {
        account: String,
        pwd: String,
        name: String,
        age: String,
        gender: String,
        nickName: String,
        imgSrc: String
    },
    { versionKey: false }
)

export const kefuModel = mongoose.model<IkefuModel>('kefus', kefuSchema)
