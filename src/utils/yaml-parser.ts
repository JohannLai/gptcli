import yaml from 'js-yaml';
import fs from 'fs';

export const getPluginConfig = (pluginName: string) => {
	// find the plugin config file in plugins folder
	const pluginConfigFile = fs.readFileSync(`./src/plugins/${pluginName}.yml`, 'utf8');

	if (!pluginConfigFile) {
		throw new Error(`Plugin ${pluginName} not found`);
	}

	const pluginConfig = yaml.load(pluginConfigFile);
	return pluginConfig;
};

