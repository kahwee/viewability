describe('horizontal', function () {
  var horizontal = window.horizontal = require('../horizontal')
  var configLeft = { offsetLeft: 10 }
  var configRight = { offsetRight: 10 }
  var docWidth = document.documentElement.clientWidth
  var quarterDoc = docWidth / 4
  var configBoth = { offsetRight: quarterDoc, offsetLeft: quarterDoc }
  var test

  beforeEach(function () {
    test = document.createElement('div')
    test.setAttribute('style', 'background: red; position: absolute; height: 40px; width: 40px')
    test.id = 'htest'
    document.body.appendChild(test)
  })

  afterEach(function () {
    test.remove()
  })

  it('should be start with being visible', function (done) {
    var result = horizontal(test)
    expect(result.value).to.be.equal(1)
    done()
  })

  it('should be off the screen at the very right', function (done) {
    test.style.left = '5000px'
    var result = horizontal(test)
    expect(result.state).to.equal('EL_IS_TOO_RIGHT')
    expect(result.value).to.equal(0)
    done()
  })

  it('should be off the screen at the very left', function (done) {
    test.style.left = '-5000px'
    var result = horizontal(test)
    expect(result.state).to.equal('EL_IS_TOO_LEFT')
    expect(result.value).to.equal(0)
    done()
  })

  it('should be off the screen left truncated', function (done) {
    test.style.left = '-1px'
    var result = horizontal(test)
    expect(result.state).to.equal('EL_LEFT_TRUNCATED')
    done()
  })

  it('should be off the screen right truncated', function (done) {
    test.style.right = '-1px'
    var result = horizontal(test)
    expect(result.state).to.equal('EL_RIGHT_TRUNCATED')
    done()
  })

  it('should start with not being visible', function (done) {
    var result = horizontal(test, configLeft)
    expect(result.state).to.equal('EL_LEFT_TRUNCATED')
    expect(result.value).to.be.equal(.75)
    done()
  })

  it('should be on the screen, when offsetLeft is taken into account', function (done) {
    test.style.left = '10px'
    var result = horizontal(test, configLeft)
    expect(result.state).to.equal('EL_IS_WITHIN_HORIZONTAL_VIEW')
    expect(result.value).to.equal(1)
    done()
  })

  it('should be off the screen, when offsetRight is taken into account', function (done) {
    test.style.right = '0px'
    var result = horizontal(test, configRight)
    expect(result.state).to.equal('EL_RIGHT_TRUNCATED')
    expect(result.value).to.equal(.75)
    done()
  })

  it('should be off the screen, when offsetRight is taken into account', function (done) {
    test.style.right = '10px'
    var result = horizontal(test, configRight)
    expect(result.state).to.equal('EL_IS_WITHIN_HORIZONTAL_VIEW')
    expect(result.value).to.equal(1)
    done()
  })

  it('should be off the screen in both directions, when offsetRight and offsetLeft are taken into account', function (done) {
    test.style.width = `${docWidth}px`
    var result = horizontal(test, configBoth)
    expect(result.state).to.equal('EL_LEFT_AND_RIGHT_TRUNCATED')
    expect(result.value).to.equal(.5)
    done()
  })

})