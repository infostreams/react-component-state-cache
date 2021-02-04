const path = require('path')
const pkg = require('./package.json')

const libraryName = pkg.name

module.exports = {
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'index.js',
        library: libraryName,
        libraryTarget: 'umd',
        publicPath: '/dist/',
        umdNamedDefine: true
    },
    resolve: {
        alias: {
            'react': path.resolve(__dirname, './node_modules/react'),
            'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
        }
    },
    externals: {
        // Don't bundle react or react-dom
        react: {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
            root: 'react'
        },
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    mode: 'production',
}

