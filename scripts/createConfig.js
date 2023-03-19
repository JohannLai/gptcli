import fs from 'fs'
import path from 'path'

const homeDir =
  process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']
const configDir = path.join(homeDir, '.config', 'gpt-cli')
const pluginsDir = path.join(configDir, 'plugins')
const configFile = path.join(configDir, '.gptrc')

// if not config directory, create it
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true })
}

// if not plugin directory, create it
if (!fs.existsSync(pluginsDir)) {
  fs.mkdirSync(pluginsDir, { recursive: true })
}

// if exits, do nothing, process exits with code 0
if (fs.existsSync(configFile)) {
  process.exit(0)
}

fs.writeFileSync(configFile, '', { mode: 0o600 })

console.log(`${configDir} directory and ${configFile} file were created.`)
