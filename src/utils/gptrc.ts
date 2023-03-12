import fs from 'fs';
import ini from 'ini';

// set get config from ~/.gptrc
// config is .ini format
// [user]
// OPEN_API_TOKEN = 123
// [gitmoji]
// token = 123

export function getConfigFromGptrc(scope: string, key: string) {
	const config = fs.readFileSync(`${process.env.HOME}/.gptrc`, 'utf8');
	const configObject = ini.parse(config);
	console.log(configObject);
	return configObject[scope][key];
}

export function setConfigToGptrc(scope: string, key: string, value: string) {
	const config = fs.readFileSync(`${process.env.HOME}/.gptrc`, 'utf8');
	const configObject = ini.parse(config);
	configObject[scope][key] = value;
	fs.writeFileSync(`${process.env.HOME}/.gptrc`, ini.stringify(configObject));
}




