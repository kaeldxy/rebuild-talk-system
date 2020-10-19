import crypto from 'crypto'
import { secret } from './secret'

export const crypt = (key: string) => {
    const hash = crypto.createHash('md5')
    hash.update(key + secret)
    return hash.digest('hex')
}
