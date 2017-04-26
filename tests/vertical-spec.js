describe('vertical', function () {
  var vertical = window.vertical = require('../vertical')  
  var configBottom = { offsetBottom: 10 }
  var configTop = { offsetTop: 10 }
  var docHeight = document.documentElement.clientHeight
  var quarterDoc = docHeight / 4
  var configBoth = { offsetTop: quarterDoc, offsetBottom: quarterDoc }

  var test

  beforeEach(function () {
    test = document.createElement('div')
    test.setAttribute('style', 'background: blue; position: absolute; height: 40px; width: 40px')
    test.id = 'vtest'
    document.body.appendChild(test)
  })

  afterEach(function () {
    test.remove()
  })

  it('should be start with being visible', function (done) {
    var result = vertical(test)
    expect(result.value).to.be.equal(1)
    done()
  })

  it('should be off the screen at the very bottom', function (done) {
    test.style.top = '5000px'
    var result = vertical(test)
    expect(result.state).to.equal('EL_IS_BELOW_VIEW')
    expect(result.value).to.be.equal(0)
    done()
  })

  it('should be off the screen at the very top', function (done) {
    test.style.top = '-5000px'
    var result = vertical(test)
    expect(result.state).to.equal('EL_IS_ABOVE_VIEW')
    expect(result.value).to.be.equal(0)
    done()
  })

  it('should be off the screen top truncated', function (done) {
    test.style.top = '-1px'
    var result = vertical(test)
    expect(result.state).to.equal('EL_TOP_TRUNCATED')
    done()
  })

  it('should be off the screen bottom truncated', function (done) {
    test.style.bottom = '-10px'
    var result = vertical(test)
    expect(result.state).to.equal('EL_BOTTOM_TRUNCATED')
    done()
  })

  it('should start with not being visible', function (done) {
    var result = vertical(test, configTop)
    expect(result.state).to.equal('EL_TOP_TRUNCATED')
    expect(result.value).to.be.equal(.75)
    done()
  })

  it('should be on the screen, when offsetTop is taken into account', function (done) {
    test.style.top = '10px'
    var result = vertical(test, configTop)
    expect(result.state).to.equal('EL_IS_WITHIN_VERTICAL_VIEW')
    expect(result.value).to.equal(1)
    done()
  })

  it('should be off the screen, when offsetBottom is taken into account', function (done) {
    test.style.bottom = '0px'
    var result = vertical(test, configBottom)
    expect(result.state).to.equal('EL_BOTTOM_TRUNCATED')
    expect(result.value).to.equal(.75)
    done()
  })

  it('should be off the screen, when offsetBottom is taken into account', function (done) {
    test.style.bottom = '10px'
    var result = vertical(test, configBottom)
    expect(result.state).to.equal('EL_IS_WITHIN_VERTICAL_VIEW')
    expect(result.value).to.equal(1)
    done()
  })

  it('should be off the screen in both directions, when offsetTop and offsetBottom are taken into account', function (done) {
    test.style.height = `${docHeight}px`
    var result = vertical(test, configBoth)
    expect(result.state).to.equal('EL_BOTTOM_AND_TOP_TRUNCATED')
    expect(result.value).to.equal(.5)
    done()
  })

})
