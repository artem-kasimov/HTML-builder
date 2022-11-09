const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')

const createDir = name => {
  fsPromises.mkdir(path.resolve(__dirname, name)).catch(err => {
    if (err.code === 'EEXIST') {
      fsPromises
        .rm(path.resolve(__dirname, name), {
          recursive: true,
        })
        .then(() => createDir(name))
    }
  })
}

createDir('project-dist')
