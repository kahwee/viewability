const webpack = require('./webpack.config.js')
const browsers = process.env.CI ? ['ChromeHeadless'] : ['Chrome']

module.exports = function (config) {
  config.set({
    basePath: '.',
    frameworks: ['mocha', 'chai', 'webpack'],
    files: [
      'tests/*-spec.js',
      'tests/**/*-spec.js'
    ],
    browsers,
    webpack: {
      ...webpack,
      mode: 'development'
    },
    preprocessors: {
      'tests/*-spec.js': ['webpack'],
      'tests/**/*-spec.js': ['webpack']
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        {
          type: 'lcov',
          subdir: 'report-lcov'
        }
      ]
    },
    client: {
      mocha: {
        ui: 'bdd',
        reporter: 'html'
      }
    },
    singleRun: !!process.env.CI
  })
}
