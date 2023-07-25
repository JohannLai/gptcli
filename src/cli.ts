import { cli } from 'cleye'
import { run } from "./run.js"
import chalk from 'chalk';
import * as url from 'url'
import { getPluginConfig } from './utils/getPluginConfig.js';
import { getConfigFromGptrc, setConfigToGptrc } from './utils/gptrc.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { getPackageVersion, getPackageJson } from './utils/getPackageJson.js';
import { PLUGINS_DIR } from './constants.js';
import updateNotifier from 'update-notifier';

// if node version < 16 , give a warning
if (Number(process.versions.node.split('.')[0]) < 16) {
  console.log(chalk.red('⚠️  Node version must be >= 16.0.0'));
  console.log(chalk.red('⚠️  Please upgrade node version'));
  process.exit(1);
}

// update notifier
const pkg = await getPackageJson();
const notifier = updateNotifier({
  pkg,
  // every day check
  updateCheckInterval: 1000 * 60 * 60 * 24,
});

notifier.notify();

const version = await getPackageVersion();

const argv = cli({
  name: 'gpt-cli',

  version: `🔥 v${version}`,

  parameters: [
    '<plugin>',
    '[optional spread...]'
  ],

  flags: {},

  help: {
    version,
    description: '✨ ALL IN ONE CLI for ChatGPT command line tool',
    usage: [
      '👉 gptcli <plugin> [optional spread...]',
      '👉 gptcli list',
      '👉 gptcli config [pluginName/user.key] [value]',
    ],
    examples: [
      '🕹️  gptcli commit',
      '🕹️  gptcli command',
      '🕹️  gptcli chat',
      '🕹️  gptcli config user.OPENAI_API_KEY sk-xxx',
      '',
      '🚀 we recommend to use alias, eval "$(gptcli alias)"',
    ],
  },
});


const { plugin, optionalSpread } = argv._;

// alias
if (argv._[0] == 'alias' || plugin == 'alias') {
  // user can use ?? to run gptcli command
  // eval "$(gptcli alias)" to set alias
  // ?? for gptcli command
  console.log(`alias '??'='gptcli command'`);
  // commit? for gptcli commit
  console.log(`alias 'commit?'='gptcli commit'`);
  // chat? for gptcli chat
  console.log(`alias 'chat?'='gptcli chat'`);
  // gitmoji? for gptcli gitmoji
  console.log(`alias 'gitmoji?'='gptcli gitmoji'`);
  // t? for gptcli translate
  console.log(`alias 't?'='gptcli translate'`);
  process.exit(0);
}

// List all plugins
if (argv._[0] == 'list') {
  const dirname = url.fileURLToPath(new URL('.', import.meta.url))

  const builtInPlugins = readdirSync(join(dirname, 'plugins')).map((plugin) => plugin.replace('.yml', ''));

  console.log(`
	${chalk.reset('\n ✨ Built-in Plugins\n   🕹️ ')}${builtInPlugins.join('\n   🕹️ ')}
	`);

  // get all  folders in plugins dir
  const InstalledPlugins = readdirSync(PLUGINS_DIR)

  console.log(`
	${chalk.reset('\n ✨ Installed Plugins\n   🕹️ ')}${InstalledPlugins.join('\n   🕹️ ')}
	`);

  process.exit(0);
}

// Config plugin
// TODO: can be refactored to a plugin, use plugin/gpt/config.yml
if (argv._[0] == 'config') {
  // e.g: optionalSpread: [ 'user.token', '123' ]
  const isSet = argv._.optionalSpread.length == 2;

  if (!isSet) {
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

const pluginConfig = await getPluginConfig(plugin);

// Print plugin info
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

// Print plugin help
if (optionalSpread[0] == 'help') {
  console.log(pluginConfig.help);

  process.exit(0);
}

run(pluginConfig, argv)

