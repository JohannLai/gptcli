import { cli } from 'cleye'
import { run } from "./run.js"
import chalk from 'chalk';
import { getPluginConfig } from './utils/getPluginConfig.js';
import { getConfigFromGptrc, setConfigToGptrc } from './utils/gptrc.js';
import { readdirSync } from 'fs';
import path from 'path';
import { join } from 'path';

export interface IArgv {
	_: {
		plugin: string;
		optionalSpread: string[];
	};
	unknownFlags: {
		[key: string]: string | boolean;
	};
}

const argv = cli({
	name: 'gpt-cli',

	// Define parameters
	parameters: [
		'<plugin>',
		'[optional spread...]'
	],

	flags: {},

	help: {
		// Define the help text
		description: 'build any cli with gpt-cli by AI',
		usage: [
			'gpt <plugin> [optional spread...]',
			'gpt list',
			'gpt config [pluginName/user.key] [value]',
		],
		examples: [
			'gpt gitmoji "fix a bug"',
			'gpt config user.OPENAI_API_KEY sk-xxx'
		],
	},
});

const { plugin, optionalSpread } = argv._;

if (argv._[0] == 'list') {
	const plugins = readdirSync(join(process.cwd(), 'src/plugins')).map((plugin) => plugin.replace('.yml', ''));
	console.log(plugins)

	console.log(`
	${chalk.underline('Available Official plugins')}
	${plugins.join('\n')}
	`);

	process.exit(0);
}

if (argv._[0] == 'config') {
	// e.g: optionalSpread: [ 'user.token', '123' ]
	const isSet = argv._.optionalSpread.length == 2;

	if (!isSet) {
		// print config
		const [scope, key] = argv._.optionalSpread[0].split('.');
		const config = getConfigFromGptrc(scope, key);

		console.log(config);
		process.exit(0);
	}

	// set config
	const [scope, key] = argv._.optionalSpread[0].split('.');
	const value = argv._.optionalSpread[1];

	setConfigToGptrc(scope, key, value);

	process.exit(0);
}

const pluginConfig = getPluginConfig(plugin);

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

run(pluginConfig, argv)

