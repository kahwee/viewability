'use strict'
$('<div id="onScreenTest" style="background: red; position: absolute; top: 0; left: 0; height: 40px; width: 40px"></div>').appendTo($(document.body))

var isElementOnScreen = require('../isElementOnScreen')
var test = document.getElementById('onScreenTest')

describe('isElementOnScreen', function () {
  it('should be start with being visible', function (done) {
    var result = isElementOnScreen(test)
    expect(result).to.be.true
    done()
  })

  it('should be start with being visible', function (done) {
    test.style.left = '5000px'
    var result = isElementOnScreen(test)
    expect(result).to.be.false
    done()
  })
})
