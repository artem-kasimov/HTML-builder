const fs = require('fs')
const path = require('path')

const copyDir = () => {
  fs.mkdir(path.resolve(__dirname, 'files-copy'), err => {
    if (err) {
      fs.readdir(path.resolve(__dirname, 'files-copy'), (err, data) => {
        if (err) {
          throw new Error(err)
        }

        data.forEach(file => {
          fs.unlink(path.resolve(__dirname, 'files-copy', file), err => {
            if (err) {
              throw new Error(err)
            }
          })
        })
      })
    }

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
}

copyDir()
