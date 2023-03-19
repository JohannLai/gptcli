import { exec } from 'child_process'
import { copyFile as _copyFile, existsSync, mkdirSync, readdir } from 'fs'
import { basename, join } from 'path'

const srcDir = 'src/plugins'
const distDir = 'dist/plugins'

// 创建 dist 目录
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true })
}

function copyFile(filePath) {
  const srcPath = filePath
  const distPath = join(distDir, basename(filePath))
  _copyFile(srcPath, distPath, (err) => {
    if (err) throw err
    console.log(`${srcPath} was copied to ${distPath}`)
  })
}

readdir(srcDir, (err, files) => {
  if (err) throw err
  files.forEach((file) => {
    if (file.endsWith('.yml')) {
      copyFile(join(srcDir, file))
    }
  })
})

exec('npx pkgroll --minify', (err, stdout, stderr) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(stdout)
})

// copy scripts/*.js to dist/scripts/*.js
readdir('scripts', (err, files) => {
  if (err) throw err
  files.forEach((file) => {
    if (file.endsWith('.js')) {
      // to dist/scripts
      const distPath = join('dist', 'scripts', file)
      // from scripts
      const srcPath = join('scripts', file)

      if (!existsSync(join('dist', 'scripts'))) {
        mkdirSync(join('dist', 'scripts'), { recursive: true })
      }

      _copyFile(srcPath, distPath, (err) => {
        if (err) throw err
        console.log(`${srcPath} was copied to ${distPath}`)
      })
    }
  })
})
