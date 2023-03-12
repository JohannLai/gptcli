import { cli } from 'cleye';
import { run } from "./run.js"
import chalk from 'chalk';
import { getPluginConfig } from './utils/yaml-parser.js';
const argv = cli({
	name: 'gpt-cli',

	// Define parameters
	parameters: [
		'<plugin>',
		'[optional spread...]'
	],

	flags: {}
})

const { unknownFlags } = argv;
const { plugin, optionalSpread } = argv._;

Object.keys(unknownFlags).forEach((flag) => {
	process.env[`flag_${flag}}`] = String(unknownFlags[flag]);
})

optionalSpread.forEach((value, index) => {
	process.env[`params_${index}`] = value;
})

const pluginConfig = getPluginConfig(plugin);

if (optionalSpread[0] == 'help') {
	console.log(pluginConfig.help)

	process.exit(0);
}

if (optionalSpread[0] == 'info') {
	const { name, description, repository } = pluginConfig;
	console.log(`
    Name: ${name}
    Description: ${description}
    Repository: ${chalk.underline(`https://github.com/${repository}`)}
    authored by: ${pluginConfig.author}
`);

	process.exit(0);
}

run(pluginConfig, optionalSpread)

