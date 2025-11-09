describe('vertical', function () {
  const vertical = window.vertical = require('../vertical')
  let test

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
    const result = vertical(test)
    expect(result.value).to.be.equal(1)
    done()
  })

  it('should be off the screen at the very bottom', function (done) {
    test.style.top = '5000px'
    const result = vertical(test)
    expect(result.state).to.equal('EL_IS_BELOW_VIEW')
    expect(result.value).to.be.equal(0)
    done()
  })

  it('should be off the screen at the very top', function (done) {
    test.style.top = '-5000px'
    const result = vertical(test)
    expect(result.state).to.equal('EL_IS_ABOVE_VIEW')
    expect(result.value).to.be.equal(0)
    done()
  })

  it('should be off the screen top truncated', function (done) {
    test.style.top = '-1px'
    const result = vertical(test)
    expect(result.state).to.equal('EL_TOP_TRUNCATED')
    done()
  })

  it('should be off the screen bottom truncated', function (done) {
    test.style.bottom = '-10px'
    const result = vertical(test)
    expect(result.state).to.equal('EL_BOTTOM_TRUNCATED')
    done()
  })
})
