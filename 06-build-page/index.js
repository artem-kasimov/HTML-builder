const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')

const createDir = name => {
  fsPromises
    .mkdir(path.resolve(__dirname, name))
    .then(() => {
      copyDir(
        'assets',
        path.resolve(__dirname, 'assets'),
        path.resolve(__dirname, 'project-dist')
      )
    })
    .catch(err => {
      if (err.code === 'EEXIST') {
        fsPromises
          .rm(path.resolve(__dirname, name), {
            recursive: true,
          })
          .then(() => createDir(name))
      }
    })
}

const copyDir = (dirName, dirPath, destDir) => {
  const destDirPath = path.resolve(destDir, dirName)
  fsPromises.mkdir(destDirPath).then(() => {
    fsPromises.readdir(dirPath).then(dirItems => {
      dirItems.forEach(item => {
        fsPromises.stat(path.resolve(dirPath, item)).then(stat => {
          if (stat.isDirectory()) {
            copyDir(item, path.resolve(dirPath, item), destDirPath)
          } else if (stat.isFile()) {
            fsPromises.copyFile(
              path.resolve(dirPath, item),
              path.resolve(destDirPath, item)
            )
          }
        })
      })
    })
  })
}

createDir('project-dist')
