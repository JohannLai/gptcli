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
	let pluginConfigFile = '';

	const dirname = url.fileURLToPath(new URL('.', import.meta.url))

	const srcConfigPath = path.join(dirname, 'plugins', `${pluginName}.yml`);
	const configPath = path.join(PLUGINS_DIR, pluginName, `${pluginName}.yml`);

	try {
		pluginConfigFile = await fs.readFile(srcConfigPath, 'utf8');
	} catch (error) {
		// If the config file doesn't exist in the source directory, try to read it from the plugins directory
		try {
			pluginConfigFile = await fs.readFile(configPath, 'utf8');
		} catch (error) {
			throw new Error(`Plugin config file not found: ${pluginName}`);
		}
	}

	const pluginConfig = yaml.load(pluginConfigFile);
	return pluginConfig as IPluginConfig;
};

