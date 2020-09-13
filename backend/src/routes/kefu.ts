import express from 'express'
import { IgetKefusQuery, IgetKefusRes } from 'MyType'
export const kefuRouter = express
    .Router()
    .get<any, IgetKefusRes, any, IgetKefusQuery>('/', (req, res, next) => {
        let { page, limit, _id } = req.query
        page = ~~page
        limit = ~~limit
        res.send()
    })
    .post('login', (req, res, next) => {})
