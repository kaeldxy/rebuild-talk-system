import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import { kefuRouter } from './routes/kefu'
import { recordRouter } from './routes/record'

const app = express()

app.use(logger('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/kefu', kefuRouter)
app.use('/record', recordRouter)

export default app
