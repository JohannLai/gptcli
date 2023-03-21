import fs from 'fs'
import os from 'os'
import path from 'path'

const homeDir = os.homedir()

const configDir = path.join(homeDir, '.config', 'gpt-cli')
const pluginsDir = path.join(configDir, 'plugins')
const configFile = path.join(configDir, '.gptrc')

try {
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
} catch (e) {
  console.error(`
Error occurred while creating config directory and file.
${e}

  `)

  console.log(`
Please create the following directory and file manually:

mkdir -p ${configDir}
mkdir -p ${pluginsDir}
touch ${configFile}

if cannot fix the issue, please open an issue on GitHub:
https://github.com/JohannLai/gptcli/issues/new , thanks!

  `)

  process.exit(0)
}
