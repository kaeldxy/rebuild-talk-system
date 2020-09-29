import express from 'express'
import { IgetKefusQuery, IgetKefusRes } from 'MyType'
import { gainKefus } from '../dao/kefu'
export const kefuRouter = express
    .Router()
    .get<any, IgetKefusRes, any, IgetKefusQuery>('/', async (req, res, next) => {
        let { page, limit, _id } = req.query
        page = ~~page
        limit = ~~limit
        const { data, total} = await gainKefus(_id, page, limit)
        res.send({
            data,
            total,
            status: true,
            msg: ''
        })
    })
    .post('login', (req, res, next) => {})
