import { Base, IConfigBase } from '../base.js';
import { replaceEnvVariables } from '../../utils/replaceEnvVariables.js';
import { createChatCompletion } from '../../utils/openaiAPI/createChatCompletion.js';
import { startLoading, stopLoading } from '../../utils/loading.js';
import logUpdate from 'log-update';
import chalk from 'chalk';


export type IMessages = Array<{
	content: string;
	role: 'user' | 'assistant';
}>

export class CreateChatCompletion extends Base {
  constructor(args: IConfigBase) {
    super(args);
  }

  public async run() {
    if (!await super.run()) {
      return;
    }

    !this.silent && startLoading('AI is thinking ...');

    const { messages } = this.with as { messages: IMessages };
    const messagesWithEnv = messages.map((item) => {
      return {
        ...item,
        content: replaceEnvVariables(
          item.content, {
            ...process.env,
            ...this.pipeline.env,
          })
      }
    });

    const apiKey = this.pipeline.env.OPENAI_API_KEY;

    const data = await createChatCompletion({
      apiKey,
      messages: messagesWithEnv,
      onMessage: (message) => {
        stopLoading();
        !this.silent && logUpdate(chalk.green('❯', message));
      }
    })

    if (!data) {
      console.log(chalk.red(this.name + 'Error: no data'));
      process.exit(1);
    }

    if (this?.export?.response_content) {
      this.pipeline.env[this.export.response_content] = data;
    }
  }
}
