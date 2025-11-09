describe('horizontal', function () {
  const horizontal = window.horizontal = require('../horizontal')
  let test

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
    const result = horizontal(test)
    expect(result.value).to.be.equal(1)
    done()
  })

  it('should be off the screen at the very right', function (done) {
    test.style.left = '5000px'
    const result = horizontal(test)
    expect(result.state).to.equal('EL_IS_TOO_RIGHT')
    expect(result.value).to.equal(0)
    done()
  })

  it('should be off the screen at the very left', function (done) {
    test.style.left = '-5000px'
    const result = horizontal(test)
    expect(result.state).to.equal('EL_IS_TOO_LEFT')
    expect(result.value).to.equal(0)
    done()
  })

  it('should be off the screen left truncated', function (done) {
    test.style.left = '-1px'
    const result = horizontal(test)
    expect(result.state).to.equal('EL_LEFT_TRUNCATED')
    done()
  })

  it('should be off the screen right truncated', function (done) {
    test.style.right = '-1px'
    const result = horizontal(test)
    expect(result.state).to.equal('EL_RIGHT_TRUNCATED')
    done()
  })
})
