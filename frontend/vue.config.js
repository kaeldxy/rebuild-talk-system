module.exports = {
    publicPath: '',
    productionSourceMap: false,
    pages: {
        index: {
            entry: 'src/index/main.ts',
            template: 'public/index.html',
            filename: 'index.html',
            title: 'Index Page',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        user: {
            entry: 'src/user/main.ts',
            template: 'public/user.html',
            filename: 'user.html',
            title: 'User Page',
            chunks: ['chunk-vendors', 'chunk-common', 'user']
        }
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
