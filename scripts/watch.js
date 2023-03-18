import { exec } from 'child_process'
import { watch } from 'chokidar'
import { copyFile as _copyFile, existsSync, mkdirSync, unlink } from 'fs'
import { basename, join } from 'path'

const srcDir = 'src/plugins'
const distDir = 'dist/plugins'

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

exec('npx pkgroll --watch', (err, stdout, stderr) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(stdout)
})

// 监听文件变化
const watcher = watch(srcDir, { ignored: /(^|[/\\])\../ })

watcher.on('add', (filePath) => {
  if (filePath.endsWith('.yml')) {
    copyFile(filePath)
  }
})

watcher.on('change', (filePath) => {
  if (filePath.endsWith('.yml')) {
    copyFile(filePath)
  }
})

watcher.on('unlink', (filePath) => {
  if (filePath.endsWith('.yml')) {
    const distPath = join(distDir, basename(filePath))
    unlink(distPath, (err) => {
      if (err) throw err
      console.log(`${distPath} was removed`)
    })
  }
})

console.log(`Watching ${srcDir} directory...`)
