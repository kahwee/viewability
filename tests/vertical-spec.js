describe('vertical', function () {
  var vertical = window.vertical = require('../vertical')
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
    test.style.bottom = '-1px'
    console.dir(test.style)
    var result = vertical(test)
    expect(result.state).to.equal('EL_BOTTOM_TRUNCATED')
    done()
  })
})
