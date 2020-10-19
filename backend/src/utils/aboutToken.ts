import jwt from 'jsonwebtoken'
import { secret } from './secret'
import expressJwt from 'express-jwt'

export const makeToken = (
    payload: string | object | Buffer,
    callback?: jwt.SignCallback
) => {
    if (callback)
        jwt.sign(
            payload,
            secret,
            {
                expiresIn: 30 * 60 * 60 * 60
            },
            callback
        )
    else
        return jwt.sign(payload, secret, {
            expiresIn: 30 * 60 * 60 * 60
        })
}
export const verifyToken = (token: string, callback?: jwt.VerifyCallback) => {
    if (callback) jwt.verify(token, secret, { algorithms: ['HS256'] }, callback)
    else return jwt.verify(token, secret, { algorithms: ['HS256'] })
}

export const jwtAuth = expressJwt({
    secret,
    algorithms: ['HS256'],
    credentialsRequired: true // false：不校验
}).unless({
    path: ['/kefu/login']
})
