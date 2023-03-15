import fs from 'fs';
import ini from 'ini';
import { CONFIG_FILE_PATH } from '../constants.js';

// set get config
// config is .ini format
// [user]
// OPEN_API_TOKEN = 123
// [gitmoji]
// token = 123

export function getConfigFromGptrc(scope: string, key: string) {
	const config = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
	const configObject = ini.parse(config);
	return configObject[scope][key];
}

export function setConfigToGptrc(scope: string, key: string, value: string) {
	const config = getConfigFromGptrc(scope, key);
	config[scope][key] = value;
	fs.writeFileSync(CONFIG_FILE_PATH, ini.stringify(config));
}




