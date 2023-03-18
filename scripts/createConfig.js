const fs = require('fs')
const path = require('path')

const homeDir =
  process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']
const configDir = path.join(homeDir, '.config', 'gpt-cli')
const configFile = path.join(configDir, '.gptrc')

// 创建配置文件夹和配置文件
fs.mkdirSync(configDir, { recursive: true })
fs.writeFileSync(configFile, '', { mode: 0o600 })

console.log(`${configDir} directory and ${configFile} file were created.`)
