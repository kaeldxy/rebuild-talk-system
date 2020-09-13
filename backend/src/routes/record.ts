import express from 'express'
import { IgetRecordsQuery, IgetRecordsRes } from 'MyType'
import { gainRecords } from '../dao/record'
export const recordRouter = express
    .Router()
    .get<any, IgetRecordsRes, any, IgetRecordsQuery>('/', async (req, res, next) => {
        let { page, limit, kefu_id } = req.query
        page = ~~page
        limit = ~~limit
        const  {data, total} = await gainRecords(kefu_id, page, limit)
        res.send({
            data,
            total,
            status: true,
            msg: ''
        })
    })
    .post('login', (req, res, next) => {})
