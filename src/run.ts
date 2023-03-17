import chalk from "chalk";
import { Renderers } from "cleye";
import { IConfigBase } from "./jobs/base.js";
import { IPluginConfig } from "./utils/getPluginConfig.js";
import { replaceEnvVariables } from "./utils/replaceEnvVariables.js";
import { getScopesConfig } from './utils/gptrc.js';

export interface IPipeline {
	env: {
		[key: string]: string;
	};
	config: IPluginConfig;
}

export async function run(pluginConfig: IPluginConfig, argv: {
	command: undefined; flags: { help: boolean | undefined; }; unknownFlags: { [flagName: string]: (string | boolean)[]; }; _: string[] & { "--": string[]; } & { plugin: string; optionalSpread: string[]; }; showHelp: (options?: { version?: string | undefined; description?: string | undefined; usage?: string | false | string[] | undefined; examples?: string | string[] | undefined; render?: ((nodes: { id?: string | undefined; type: keyof Renderers; data: any; }[], renderers: Renderers) => string) | undefined; } | undefined) => void; showVersion: () => void;
}) {
	const { unknownFlags } = argv;
	const { optionalSpread } = argv._;

	// prepare pipeline
	const pipeline: IPipeline = {
		env: {},
		config: pluginConfig,
	};


	// replace plugin env variables
	Object.keys(pluginConfig.env).forEach((key) => {
		pipeline.env[key] = pluginConfig.env[key]
	})

	// load config from gptrc of user and plugin name into pipeline
	const scopesConfig = await getScopesConfig(['user', pluginConfig.name]);
	Object.keys(scopesConfig).forEach((key) => {
		pipeline.env[key] = scopesConfig[key];
	})

	Object.keys(unknownFlags).forEach((flag) => {
		pipeline.env[`flag_${flag}}`] = String(unknownFlags[flag]);
	})

	optionalSpread.forEach((value, index) => {
		process.env[`params_${index}`] = value;
	})

	// run steps
	const { steps } = pluginConfig;
	for (const step of steps) {
		const { name, with: with_, if: if_, script, export: export_, uses, } = step;
		let jobPath: string;
		// uses and script are mutually exclusive
		if (uses) {
			const [dir, jobName] = uses.split(':');
			jobPath = `./jobs/${dir}/${jobName}.js`;
		} else {
			jobPath = `./jobs/script.js`;
		}

		const job = await import(jobPath).then((module) => Object.values(module)[0] as any).catch((err) => {
			console.error(err)
			console.error(chalk.red(`Error: Plugin ${pluginConfig.name} Not Found`));
			process.exit(1);
		});

		const jobInstance = new job({
			name,
			with: with_,
			if: if_,
			script,
			export: export_,
			pipeline,
			uses,
		} as IConfigBase);

		await jobInstance.run();
	}
}
