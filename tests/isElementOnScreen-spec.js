/* eslint no-unused-expressions: 0 */
describe('isElementOnScreen', function () {
  var isElementOnScreen = require('../isElementOnScreen')
  var test

  beforeEach(function () {
    test = document.createElement('div')
    test.setAttribute('style', 'background: green; position: absolute; height: 40px; width: 40px')
    test.id = 'onScreenTest'
    document.body.appendChild(test)
  })

  afterEach(function () {
    test.remove()
  })

  it('should be start with being visible', function (done) {
    var result = isElementOnScreen(test)
    expect(result).to.be.true
    done()
  })

  it('should be not visible', function (done) {
    test.style.left = '-5000px'
    var result = isElementOnScreen(test)
    expect(result).to.be.false
    done()
  })
})
