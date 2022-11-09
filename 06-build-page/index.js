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
    .then(() => {
      mergeStyles('styles', 'project-dist', 'style.css')
    })
    .then(async () => {
      let components
      await fsPromises
        .readdir(path.resolve(__dirname, 'components'))
        .then(fileNames => (components = fileNames.map(fn => fn.slice(0, -5))))
      return components
    })
    .then(async components => {
      let strings
      await fsPromises
        .readFile(path.resolve(__dirname, 'template.html'), 'utf-8')
        .then(data => (strings = data.split('\n')))

      let numsOfStrs = []
      let namesOfComponents = []

      strings.forEach((str, i) => {
        for (let component of components) {
          if (str.trim() === `{{${component}}}`) {
            numsOfStrs.push(i)
            namesOfComponents.push(component + '.html')
          }
        }
      })

      for (let i = 0; i < namesOfComponents.length; i++) {
        await fsPromises
          .readFile(
            path.resolve(__dirname, 'components', namesOfComponents[i]),
            'utf-8'
          )
          .then(fileContent => {
            strings[numsOfStrs[i]] = fileContent
          })
      }
      return strings
    })
    .then(strings => {
      fsPromises.writeFile(
        path.resolve(__dirname, 'project-dist', 'index.html'),
        strings.join('\n')
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

const mergeStyles = (srcDir, destDir, outputFile) => {
  fs.readdir(
    path.resolve(__dirname, srcDir),
    { withFileTypes: true },
    (err, data) => {
      if (err) {
        throw new Error(err)
      }

      const styles = fs.createWriteStream(
        path.resolve(__dirname, destDir, outputFile)
      )

      data.forEach(file => {
        if (
          file.isFile() &&
          path.extname(path.resolve(__dirname, srcDir, file.name)) === '.css'
        ) {
          const readStream = fs.createReadStream(
            path.resolve(__dirname, srcDir, file.name)
          )

          readStream.on('data', data => {
            styles.write(data.toString() + '\n')
          })
        }
      })
    }
  )
}

createDir('project-dist')
