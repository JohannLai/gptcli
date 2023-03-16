import fs from 'fs';
import ini from 'ini';
import { CONFIG_FILE_PATH } from '../constants.js';

// set get config
// config is .ini format
// [user]
// OPEN_API_TOKEN = 123
// [gitmoji]
// token = 123

type scopeConfig = {
	[key: string]: string;
};

type config = {
	[scope: string]: scopeConfig;
};

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

export function getScopeConfig(scope: string) {
	const config = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
	const configObject = ini.parse(config);
	return configObject[scope];
}

// get multiple scopes config, e.g: ['user', 'gitmoji']
// last scope config will override the previous one
export function getScopesConfig(scopes: string[]): scopeConfig {
	const config = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
	const configObject = ini.parse(config);
	let result: scopeConfig = {};
	scopes.forEach((scope) => {
		result = { ...result, ...configObject[scope] };
	});

	return result;
}
