const fs = require('fs')
const path = require('path')

const readStream = fs.createReadStream(path.resolve(__dirname, 'text.txt'))
const { stdout } = process

readStream.on('data', chunk => {
  stdout.write(chunk)
})
