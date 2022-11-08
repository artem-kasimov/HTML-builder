const fs = require('fs')
const path = require('path')

const copyDir = () => {
  fs.promises
    .mkdir(path.resolve(__dirname, 'files-copy'))
    .then(() => {
      fs.readdir(path.resolve(__dirname, 'files'), (err, data) => {
        if (err) {
          throw new Error(err)
        }

        data.forEach(file => {
          fs.copyFile(
            path.resolve(__dirname, 'files', file),
            path.resolve(__dirname, 'files-copy', file),
            err => {
              if (err) {
                throw new Error(err)
              }
            }
          )
        })
      })
    })
    .catch(() => {
      fs.promises
        .readdir(path.resolve(__dirname, 'files-copy'))
        .then(data => {
          data.forEach(file => {
            fs.promises.unlink(path.resolve(__dirname, 'files-copy', file))
          })
        })
        .then(() => fs.promises.rmdir(path.resolve(__dirname, 'files-copy')))
        .then(() => copyDir())
    })
}

copyDir()
