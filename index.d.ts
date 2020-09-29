declare module 'MyType' {
    import { Document } from 'mongoose'

    interface IsingleMsg {
        content: Blob | string
        contentType: 'sting' | 'images'
        sayType: 'user' | 'kefu'
        time: number
    }
    interface IuserInfo {
        ip: string
        addr: string
        os: string
    }
    interface IkefuInfo {
        kefu_id: string
        kefuSocketId: string
        sesstionNum: number
        status: boolean
    }
    interface IkefuToServer {
        userSocketId: string
        data: IsingleMsg
    }

    interface IcurrentConnects {
        [userSocketId: string]: {
            kefu: {
                kefu_id: string
                kefuSocketId: string
                sesstionNum: number
                status: boolean
            }
            disconnectMsgList: IsingleMsg[]
        }
    }

    interface IawaitList {
        [userSocketId: string]: {
            userInfo: IuserInfo
            talkList: IsingleMsg[]
        }
    }
    interface Ikefu {
        _id: string
        account: string
        pwd: string
        name: string
        age: string
        gender: string
        nickName: string
        imgSrc: string
    }
    interface IkefuModel extends Document, Ikefu {}
    interface Irecord {
        _id: string
        userInfo: {
            ip: string
            addr: string
            os: string
        }
        startTime: number
        endTime: number
        talkList: [
            {
                contentType: 'sting' | 'images'
                sayType: 'user' | 'kefu'
                time: number
                content: string
            }
        ]
        kefu_id: string
    }
    interface IrecordModel extends Document, Irecord {}
    // 获取账号信息的接口  /kefu/ GET
    interface IgetKefusQuery {
        page: number
        limit: number
        _id: string
    }
    interface IgetKefusRes {
        status: boolean
        msg: string
        data: Ikefu[]
        total: number
    }
    // 获取聊天记录的接口  /record/ GET
    interface IgetRecordsQuery {
        page: number
        limit: number
        kefu_id: string
    }
    interface IgetRecordsRes {
        status: boolean
        msg: string
        data: Irecord[]
        total: number
    }
}
