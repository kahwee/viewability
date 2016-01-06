module.exports = function (config) {
  var headless = process.env.USER === 'jenkins'
  var preprocessors = {}
  preprocessors['./js/**/*.js'] = ['coverage']
  preprocessors['./tests/**/*.js'] = ['browserify']

  var browsers = headless ? ['PhantomJS'] : ['Chrome']

  config.set({
    basePath: '.',
    reporters: ['coverage'],
    frameworks: ['browserify', 'mocha', 'sinon-chai'],
    browsers: browsers,
    preprocessors: preprocessors,
    files: [
      './node_modules/jquery/dist/jquery.js',
      './tests/*.js'
    ],
    browserify: {
      debug: true,
      configure: function (bundle) {
        bundle.on('prebundle', function () {})
      }
    },
    client: {
      mocha: {
        reporter: 'html'
      }
    },
    junitReporter: {
      outputFile: '_karma.xml',
      suite: ''
    },
    coverageReporter: {
      dir: 'coverage',
      reporters: [{
        type: 'cobertura',
        subdir: '.',
        file: 'cobertura.xml'
      }, {
        type: 'html',
        subdir: '.'
      }]
    },
    singleRun: headless
  // logLevel: 'DEBUG'
  })
}
