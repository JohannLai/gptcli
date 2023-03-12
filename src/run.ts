import { IConfigBase } from "./jobs/base.js";

export async function run(pluginConfig: any, optionalSpread: string[]) {
	const pipeline = {
		env: pluginConfig.env,
		config: pluginConfig.config,
	};

	const { steps } = pluginConfig;

	for (const step of steps) {
		const { name, with: with_, if: if_, script, export: export_, uses, } = step;
		if (uses) {
			const [dir, jobName] = uses.split(':');
			const job = await import(`./jobs/${dir}/${jobName}.js`).then((module) => Object.values(module)[0] as any);

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

			continue;
		}

		if (script) {
			const job = await import(`./jobs/script.js`).then((module) => Object.values(module)[0] as any);

			const jobInstance = new job({
				name,
				with: with_,
				if: if_,
				script,
				export: export_,
				pipeline,
				uses,
			} as IConfigBase);

			jobInstance.run();

			return;
		}
	}
}
