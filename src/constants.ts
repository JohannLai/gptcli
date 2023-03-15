import os from 'os'
import path from 'path'

const homeDir = os.homedir();

export const CONFIG_DIR = path.join(homeDir, '.config', 'gpt-cli');
export const CONFIG_FILE_PATH = path.join(CONFIG_DIR, '.gptrc');
// installed plugins dir
export const PLUGINS_DIR = path.join(CONFIG_DIR, 'plugins');
