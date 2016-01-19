/* jshint ignore:start */
'use strict'
$('<div id="vtest" style="background: blue; position: absolute; top: 0; left: 0; height: 40px; width: 40px"></div>').appendTo($(document.body))

var vertical = window.vertical = require('../vertical')
var test = document.getElementById('vtest')

describe('vertical', function () {
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
})
/* jshint ignore:end */
