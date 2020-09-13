#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app'
import df from 'debug'
import { createServer } from 'http'
import { AddressInfo } from 'net'
import socket from 'socket.io'
import { socketHandler } from '../socket'

interface MyError extends Error {
    syscall: string
    code: string
}
const debug = df('backend:server')
/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = createServer(app)
const io = socket(server)

socketHandler(io)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)

server.on('error', onerror)

function onerror(error: MyError) {
    if (error.syscall !== 'listen') {
        throw error
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}
server.on('listening', () => {
    const addr = server.address()
    const bind =
        typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + (addr as AddressInfo).port
    debug('Listening on ' + bind)
})

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        // named pipe
        return val
    }

    if (port >= 0) {
        // port number
        return port
    }

    return false
}
