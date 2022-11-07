const fs = require('fs')
const path = require('path')
const output = fs.createWriteStream(path.resolve(__dirname, 'text.txt'))

process.stdout.write('Write your text: \n')

process.stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    process.exit()
  }
  output.write(data)
})

process.on('exit', () => process.stdout.write('Goodbye!'))
