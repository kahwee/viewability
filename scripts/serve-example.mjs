import { createReadStream } from 'node:fs'
import { createServer } from 'node:http'

const files = new Map([
  ['/', ['examples/index.html', 'text/html; charset=utf-8']],
  ['/example.js', ['examples/example.js', 'text/javascript; charset=utf-8']],
  ['/styles.css', ['examples/styles.css', 'text/css; charset=utf-8']],
  ['/viewability.min.js', ['dist/viewability.min.js', 'text/javascript; charset=utf-8']],
])

createServer((request, response) => {
  const entry = files.get(request.url ?? '/')
  if (!entry) {
    response.writeHead(404).end('Not found')
    return
  }

  response.writeHead(200, { 'content-type': entry[1], 'cache-control': 'no-store' })
  createReadStream(new URL(`../${entry[0]}`, import.meta.url)).pipe(response)
}).listen(4173, '127.0.0.1', () => {
  console.log('Viewability example: http://127.0.0.1:4173')
})
