import mongoose from 'mongoose'
import { IrecordModel } from 'MyType'
const recordSchema = new mongoose.Schema<IrecordModel>(
    {
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
        kefu_id: { type: mongoose.Types.ObjectId, ref: 'kefus' }
    },
    { versionKey: false }
)
export const recordModel = mongoose.model<IrecordModel>('records', recordSchema)

