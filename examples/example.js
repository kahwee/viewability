const target = document.querySelector('#target')
const x = document.querySelector('#x')
const y = document.querySelector('#y')

function percent(value) {
  return `${Math.round(value * 100)}%`
}

function render() {
  const targetSize = target.offsetWidth
  const left = (window.innerWidth + targetSize) * (Number(x.value) / 100) - targetSize
  const top = (window.innerHeight + targetSize) * (Number(y.value) / 100) - targetSize

  target.style.left = `${left}px`
  target.style.top = `${top}px`
  document.querySelector('#x-output').value = `${x.value}%`
  document.querySelector('#y-output').value = `${y.value}%`

  const result = viewability.measure(target)
  document.querySelector('#area').textContent = percent(result.value)
  document.querySelector('#vertical').textContent = percent(result.vertical.value)
  document.querySelector('#horizontal').textContent = percent(result.horizontal.value)
  document.querySelector('#vertical-state').textContent = result.vertical.state
  document.querySelector('#horizontal-state').textContent = result.horizontal.state
}

x.addEventListener('input', render)
y.addEventListener('input', render)
window.addEventListener('resize', render)
render()
