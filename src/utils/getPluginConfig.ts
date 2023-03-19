import yaml from 'js-yaml';
import fs from 'fs/promises';
import { PLUGINS_DIR } from '../constants.js';
import path from 'path';
import * as url from 'url'

export interface IPluginConfig {
	name: string;
	description: string;
	repository: string;
	author: string;
	help: string;
	env: {
		[key: string]: string;
	};
	steps: {
		name: string;
		uses?: string;
		if?: string;
		script?: string | string[];
		silent?: boolean;
		with?: {
			messages: {
				role: string;
				content: string;
			}[];
		};
		export?: {
			response_content: string;
		};
	}[];
}

export const getPluginConfig = async (pluginName: string) => {
	// if the pluginName is a path and  include a .yml file, then read the config from that file
	// for local development and config file in the project directory
	if (pluginName.includes('.yml')) {
		// just use the pluginName as the path
		const pluginConfigPath = pluginName;
		const rawPluginConfig = await fs.readFile(pluginConfigPath, 'utf8')
		return yaml.load(rawPluginConfig) as IPluginConfig;
	}

	// for the normal case
	let rawPluginConfig = '';

	const dirname = url.fileURLToPath(new URL('.', import.meta.url))

	const srcConfigPath = path.join(dirname, 'plugins', `${pluginName}.yml`);
	const configPath = path.join(PLUGINS_DIR, pluginName, `${pluginName}.yml`);

	try {
		rawPluginConfig = await fs.readFile(srcConfigPath, 'utf8');
	} catch (error) {
		// If the config file doesn't exist in the source directory, try to read it from the plugins directory
		try {
			rawPluginConfig = await fs.readFile(configPath, 'utf8');
		} catch (error) {
			throw new Error(`Plugin config file not found: ${pluginName}, I tried to read it from ${srcConfigPath} and ${configPath}`);
		}
	}

	const pluginConfig = yaml.load(rawPluginConfig);
	return pluginConfig as IPluginConfig;
};

