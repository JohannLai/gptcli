import { exec } from 'child_process'
import { copyFile as _copyFile, existsSync, mkdirSync, readdir } from 'fs'
import { basename, join } from 'path'

const srcDir = 'src/plugins'
const distDir = 'dist/plugins'

// 创建 dist 目录
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true })
}

// 处理文件复制操作
function copyFile(filePath) {
  const srcPath = filePath
  const distPath = join(distDir, basename(filePath))
  _copyFile(srcPath, distPath, (err) => {
    if (err) throw err
    console.log(`${srcPath} was copied to ${distPath}`)
  })
}

// 获取源文件夹中的 yml 文件列表
readdir(srcDir, (err, files) => {
  if (err) throw err
  files.forEach((file) => {
    if (file.endsWith('.yml')) {
      copyFile(join(srcDir, file))
    }
  })
})

// exec command npx pkgroll --minify

exec('npx pkgroll --minify', (err, stdout, stderr) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(stdout)
})
