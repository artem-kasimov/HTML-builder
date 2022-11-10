const path = require('path')
const fsPromises = require('fs/promises')

fsPromises
  .mkdir(path.resolve(__dirname, 'files-copy'))
  .then(() => {
    copyFiles(
      path.resolve(__dirname, 'files'),
      path.resolve(__dirname, 'files-copy')
    )
  })
  .catch(err => {
    if (err.code === 'EEXIST') {
      fsPromises
        .rm(path.resolve(__dirname, 'files-copy'), { recursive: true })
        .then(() => {
          fsPromises
            .mkdir(path.resolve(__dirname, 'files-copy'))
            .then(() =>
              copyFiles(
                path.resolve(__dirname, 'files'),
                path.resolve(__dirname, 'files-copy')
              )
            )
        })
    }
  })

const copyFiles = (filesPath, copyPath) => {
  fsPromises.readdir(filesPath).then(files => {
    files.forEach(file => {
      fsPromises.stat(path.resolve(filesPath, file)).then(stat => {
        if (stat.isFile()) {
          fsPromises.copyFile(
            path.resolve(filesPath, file),
            path.resolve(copyPath, file)
          )
        } else if (stat.isDirectory()) {
          fsPromises.mkdir(path.resolve(copyPath, file)).then(() => {
            copyFiles(
              path.resolve(filesPath, file),
              path.resolve(copyPath, file)
            )
          })
        }
      })
    })
  })
}
