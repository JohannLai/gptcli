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

export function getAllConfigFromGptrc() {
	const config = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
	const configObject = ini.parse(config);
	return configObject;
}

export function getConfigFromGptrc(scope: string, key: string) {
	const configObject = getAllConfigFromGptrc()
	return configObject?.[scope]?.[key];
}

export function setConfigToGptrc(scope: string, key: string, value: string) {
	const allConfig = getAllConfigFromGptrc();
	const configObject: config = {
		...allConfig,
		[scope]: {
			...allConfig[scope],
			[key]: value,
		},
	};

	const configString = ini.stringify(configObject);
	fs.writeFileSync(CONFIG_FILE_PATH, configString);
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
