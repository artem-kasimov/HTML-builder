const fs = require('fs')
const path = require('path')

fs.readdir(
  path.resolve(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, data) => {
    if (err) {
      throw new Error(err)
    }

    data.forEach(dirent => {
      if (dirent.isFile()) {
        let extname = path.extname(
          path.resolve(__dirname, 'secret-folder', dirent.name)
        )

        fs.stat(
          path.resolve(__dirname, 'secret-folder', dirent.name),
          (err, stats) => {
            if (err) {
              throw new Error(err)
            }

            let size = stats.size / 1024 + 'kb'

            let dot = dirent.name.indexOf('.')

            if (dot > -1) {
              process.stdout.write(
                `${dirent.name.slice(0, dot)} - ${extname.slice(1)} - ${size}\n`
              )
            } else {
              process.stdout.write(`${dirent.name} -- ${size}\n`)
            }
          }
        )
      }
    })
  }
)
