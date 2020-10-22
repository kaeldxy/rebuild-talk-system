import mongoose from 'mongoose'
import { IkefuModel } from 'MyType'
const kefuSchema = new mongoose.Schema(
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
