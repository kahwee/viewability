const path = require('path')
const fs = require('fs')
const babelRc = JSON.parse(fs.readFileSync('./.babelrc', { encoding: 'utf8' }))

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    viewability: './viewability.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            ...babelRc,
            cacheDirectory: true
          }
        }
      }
    ]
  }
}
