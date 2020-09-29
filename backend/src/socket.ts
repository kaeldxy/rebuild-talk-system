import {
    //基础类型
    IawaitList,
    IcurrentConnects,
    IonlineKefus,
    IkefuInfo,
    IsingleMsg,
    IuserInfo,
    // socket接口数据
    IkefuToServer,
    IserverToKefu,
    IserverToKefu_userinto,
    IserverToKefu_awaitList,
    IuserToServer,
    IserverToKefu_reconlist
} from 'MyType'
import { Server, Socket } from 'socket.io'
import _ from 'lodash'

const isProduction = process.env.NODE_ENV === 'production'

const currentConnects: IcurrentConnects = {}
let awaitList: IawaitList = {}
const onlineKefus: IonlineKefus = {}

export const socketHandler = (io: Server) => {
    const userNameSpace = io.of('/user')
    const kefuNameSpace = io.of('/kefu')

    const removeUserSocket = (userSocket: Socket, userSocketId: string) => {
        //移除userSocket及其相关监听器
        userSocket.removeAllListeners('user_to_server')
        userSocket.removeAllListeners('disconnect')
        delete userNameSpace.sockets[userSocketId]
    }

    io.use((socket, next) => {
        if (isProduction && socket.handshake.xdomain)
            return socket.disconnect(true)
        next()
    })

    userNameSpace.on('connection', userSocket => {
        const userSocketId = userSocket.id
        const userInfo: IserverToKefu_userinto = JSON.parse(
            userSocket.handshake.query.userInfo
        )
        const kefu = _.minBy(_.filter(onlineKefus, 'kefuIsOk'), 'sesstionNum')

        if (kefu) {
            kefu.sesstionNum++
            currentConnects[userSocketId] = { kefu, extraSesstionList: [] }
            kefuNameSpace
                .to(kefu.kefuSocketId)
                .emit('server_to_kefu-userinto', userInfo)
        } else {
            awaitList[userSocketId] = { userInfo, talkList: [] }
        }

        userSocket
            .on('user_to_server', (data: IuserToServer) => {
                if (awaitList[userSocketId])
                    awaitList[userSocketId].talkList.push(data)
                else {
                    const curkefu = currentConnects[userSocketId]?.kefu
                    if (curkefu) {
                        if (curkefu.kefuIsOk)
                            kefuNameSpace
                                .to(curkefu.kefuSocketId)
                                .emit('server_to_kefu', data)
                        else
                            currentConnects[
                                userSocketId
                            ].extraSesstionList.push(data)
                    } else
                        userSocket.emit(
                            'server_to_user-kefudiscon',
                            '客服已经离线'
                        )
                    removeUserSocket(userSocket, userSocketId)
                }
            })
            .on('disconnect', () => {
                if (currentConnects[userSocketId]) {
                    const curkefu = currentConnects[userSocketId].kefu
                    kefuNameSpace
                        .to(curkefu.kefuSocketId)
                        .emit('server_to_kefu-userdiscon', userSocketId)
                    curkefu.sesstionNum--
                    delete currentConnects[userSocketId]
                }
                if (awaitList[userSocketId]) delete awaitList[userSocketId]
                removeUserSocket(userSocket, userSocketId)
            })
    })

    // kefu
    const maxLen = 10
    const spliceTimeOut = 180000

    const kefuMaxTimeOut = 3
    const kefuMaxTimeOutUnit = 60000

    const spliceAwaitList = () => {
        let sesstionNum = 0
        const sendData: IserverToKefu_awaitList = {}
        for (const userSocketId in awaitList) {
            sesstionNum++
            if (sesstionNum <= maxLen) {
                sendData[userSocketId] = awaitList[userSocketId]
                delete awaitList[userSocketId]
            } else {
                return { done: false, sendData, sesstionNum }
            }
        }
        return { done: true, sendData, sesstionNum }
    }

    kefuNameSpace
        .use((kefuSocket, next) => {
            const token: string = kefuSocket.handshake.query.token
            // vaildToken
            next()
        })

        .on('connection', kefuSocket => {
            let spliceTimer: NodeJS.Timeout
            let disconTimer: NodeJS.Timeout | unknown
            const kefu_id: string = kefuSocket.handshake.query.kefu_id
            const kefuSocketId = kefuSocket.id

            let kefu = onlineKefus[kefu_id]
            if (kefu) {
                clearInterval(disconTimer as NodeJS.Timeout)
                Object.assign(kefu, {
                    kefuSocketId,
                    kefuIsOk: true,
                    timeOut: 0
                })
                const data: IserverToKefu_reconlist = {}
                for (const userSocketId in currentConnects) {
                    const { kefu: Ikefu, extraSesstionList } = currentConnects[
                        userSocketId
                    ]
                    if (Ikefu === kefu && extraSesstionList.length > 0)
                        data[userSocketId] = extraSesstionList
                }
                kefuSocket.emit('server_to_kefu-reconlist', data)
            } else
                onlineKefus[kefu_id] = kefu = {
                    kefuSocketId,
                    sesstionNum: 0,
                    kefuIsOk: true,
                    timeOut: 0
                }

            if (!_.isEmpty(awaitList)) {
                const { done, sendData, sesstionNum } = spliceAwaitList()
                kefu.sesstionNum += sesstionNum
                kefuSocket.emit('server_to_kefu-awaitList', sendData)
                if (!done) {
                    spliceTimer = setInterval(() => {
                        if (!_.isEmpty(awaitList)) {
                            const {
                                done,
                                sendData,
                                sesstionNum
                            } = spliceAwaitList()
                            kefu.sesstionNum += sesstionNum
                            kefuSocket.emit(
                                'server_to_kefu-awaitList',
                                sendData
                            )
                            if (done) {
                                clearInterval(spliceTimer)
                            }
                        }
                    }, spliceTimeOut)
                }
            }

            kefuSocket
                .on(
                    'kefu_to_server',
                    ({ data, userSocketId }: IkefuToServer) => {
                        userNameSpace
                            .to(userSocketId)
                            .emit('server_to_user', data)
                    }
                )

                .on('disconnect', () => {
                    kefu.kefuIsOk = false
                    disconTimer = setInterval(() => {
                        kefu.timeOut++
                        if (kefu.timeOut === kefuMaxTimeOut) {
                            if(onlineKefus[kefu_id]) delete onlineKefus[kefu_id]
                            for(const userSocketId in currentConnects){
                                const Ikefu = currentConnects[userSocketId].kefu
                                if(kefu === Ikefu) delete currentConnects[userSocketId]
                            }
                            clearInterval(disconTimer as NodeJS.Timeout)
                            kefuSocket.removeAllListeners('kefu_to_server')
                            kefuSocket.removeAllListeners('disconnect')
                            delete kefuNameSpace.sockets[kefuSocketId]
                            kefuSocket.disconnect(true)
                        }
                    }, kefuMaxTimeOutUnit)
                })
        })
}
//   