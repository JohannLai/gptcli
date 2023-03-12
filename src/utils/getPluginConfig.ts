import yaml from 'js-yaml';
import fs from 'fs';

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

export const getPluginConfig = (pluginName: string): IPluginConfig => {
	// find the plugin config file in plugins folder
	const pluginConfigFile = fs.readFileSync(`./src/plugins/${pluginName}.yml`, 'utf8');

	if (!pluginConfigFile) {
		throw new Error(`Plugin ${pluginName} not found`);
	}

	const pluginConfig = yaml.load(pluginConfigFile);
	return pluginConfig as IPluginConfig;
};

