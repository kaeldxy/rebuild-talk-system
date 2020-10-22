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
        kefuSocketId: string
        sesstionNum: number
        kefuIsOk: boolean //是否在线
        timeOut: number //离线之后的时长单位分钟
    }
    interface IcurrentConnects {
        [userSocketId: string]: {
            kefu: IkefuInfo
            extraSesstionList: IsingleMsg[]
        }
    }
    interface IonlineKefus {
        [kefu_id: string]: IkefuInfo
    }
    interface IawaitList {
        [userSocketId: string]: {
            userInfo: IuserInfo
            talkList: IsingleMsg[]
        }
    }

    // socket接口

    interface IuserConnectQuery {
        userInfo: string // 转JSON
    }
    interface IkefuConnectQuery {
        token: string
        kefu_id: string
    }

    type IserverToKefu = IsingleMsg //服务器发送给客服的普通消息
    type IserverToKefu_awaitList = IawaitList //服务器发送给客服的等待消息
    type IserverToKefu_userinto = IuserInfo //服务器发送给客服的 用户进线通知
    type IserverToKefu_userdiscon = string //服务器发送给客服的 用户断开连接， 发送的usersocketId
    interface IserverToKefu_reconlist {
        // 服务器发送客服的 客服断开链接在一定时间内 重连后 发送的一些暂存的消息
        [userSocketId: string]: IsingleMsg[]
    }

    interface IkefuToServer {
        // kefu发送给服务器的普通消息
        data: IsingleMsg
        userSocketId: string
    }

    type IuserToServer = IsingleMsg //用户发送给服务器的普通消息
    type IserverToUser = IsingleMsg //服务器发送给用户的普通消息
    type IserverToUser_kefudiscon = string // 服务器发送给用户的 客服已经离线
    // 数据库结构

    interface Ikefu {
        // _id: string
        account: string
        pwd: string
        name: string
        age: string
        gender: string
        nickName: string
        imgSrc: string
    }

    type IkefuModel = Ikefu & Document

    interface Irecord {
        // _id: string
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

    type IrecordModel = Document & Irecord

    //api接口
    interface IgetKefusQuery {
        // 获取账号信息的接口  /kefu/ GET
        page: number
        limit: number
        _id: string
    }
    interface IgetKefusRes {
        // 返回
        status: boolean
        msg: string
        data: Ikefu[]
        total: number
    }

    interface IgetRecordsQuery {
        // 获取聊天记录的接口  /kefu/ GET
        page: number
        limit: number
        kefu_id: string
    }
    interface IgetRecordsRes {
        // 返回
        status: boolean
        msg: string
        data: Irecord[]
        total: number
    }
}
