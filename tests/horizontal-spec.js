/* jshint ignore:start */
'use strict'
$('<div id="htest" style="background: red; position: absolute; top: 0; left: 0; height: 40px; width: 40px"></div>').appendTo($(document.body))

var horizontal = window.horizontal = require('../horizontal')
var test = document.getElementById('htest')

describe('horizontal', function () {
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
})
/* jshint ignore:end */
