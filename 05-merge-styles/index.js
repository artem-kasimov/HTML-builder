const fs = require('fs')
const path = require('path')

fs.readdir(
  path.resolve(__dirname, 'styles'),
  { withFileTypes: true },
  (err, data) => {
    if (err) {
      throw new Error(err)
    }

    const styles = fs.createWriteStream(
      path.resolve(__dirname, 'project-dist', 'bundle.css')
    )

    data.forEach(file => {
      if (
        file.isFile() &&
        path.extname(path.resolve(__dirname, 'styles', file.name)) === '.css'
      ) {
        const readStream = fs.createReadStream(
          path.resolve(__dirname, 'styles', file.name)
        )

        readStream.on('data', data => {
          styles.write(data.toString() + '\n')
        })
      }
    })
  }
)
