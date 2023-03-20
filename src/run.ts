import chalk from "chalk";
import { Renderers } from "cleye";
import { IConfigBase } from "./jobs/base.js";
import { IPluginConfig } from "./utils/getPluginConfig.js";
import { getScopesConfig } from './utils/gptrc.js';
import { getFreeOpenaiKey } from "./utils/openaiAPI/getFreeOpenaiKey.js";

export interface IPipeline {
  env: {
    [key: string]: string;
  };
  config: IPluginConfig;
}

export async function run(pluginConfig: IPluginConfig, argv: {
  command: undefined; flags: { version: boolean | undefined; help: boolean | undefined; }; unknownFlags: { [flagName: string]: (string | boolean)[]; }; _: string[] & { "--": string[]; } & { plugin: string; optionalSpread: string[]; }; showHelp: (options?: {
    version?: string | undefined; description?: string | undefined; usage?: string | false | string[] | undefined; examples?: string | string[] | undefined; render?: ((nodes: { id?: string | undefined; type: keyof Renderers; data: any; }[], renderers: Renderers
      // prepare pipeline
    ) => string) | undefined;
  } | undefined) => void; showVersion: () => void;
}) {
  const { unknownFlags } = argv;
  const { optionalSpread } = argv._;

  // prepare pipeline
  const pipeline: IPipeline = {
    env: {},
    config: pluginConfig,
  };

  // replace plugin env variables
  pluginConfig.env && Object.keys(pluginConfig.env).forEach((key) => {
    pipeline.env[key] = pluginConfig.env[key]
  })

  // load config from gptrc of user and plugin name into pipeline
  const scopesConfig = await getScopesConfig(['user', pluginConfig.name]);
  Object.keys(scopesConfig).forEach((key) => {
    pipeline.env[key] = scopesConfig[key];
  })

  if (!pipeline.env.OPENAI_API_KEY) {
    // hack OPENAI_API_KEY  0.3 show warning for free key
    Math.random() < 0.3 &&
      console.log(chalk.yellow(`
⚠️  OPENAI_API_KEY not found, using free key(not stable)
please set your own key by:
gptcli config user.OPENAI_API_KEY sk-xxx
`))
    pipeline.env.OPENAI_API_KEY = getFreeOpenaiKey()
  }

  Object.keys(unknownFlags).forEach((flag) => {
    // hack to get the first value of unknownFlags
    pipeline.env[`flag_${flag}`] = String(unknownFlags[flag][0]);
  })

  optionalSpread.forEach((value, index) => {
    process.env[`params_${index}`] = value;
  })

  // run steps
  const { steps } = pluginConfig;
  for (const step of steps) {
    const { name, with: with_, if: if_, script, export: export_, uses, silent } = step;
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
      silent
    } as IConfigBase);

    await jobInstance.run();
  }
}
