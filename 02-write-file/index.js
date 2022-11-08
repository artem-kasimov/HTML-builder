const fs = require('fs')
const path = require('path')
const output = fs.createWriteStream(path.resolve(__dirname, 'text.txt'))

const end = () => {
  process.stdout.write('Goodbye!')
  process.exit()
}

process.stdout.write('Write your text: \n')

process.stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    end()
  }
  output.write(data)
})

process.on('SIGINT', end)
