import { Base, IConfigBase } from '../base.js';
import { replaceEnvVariables } from '../../utils/replaceEnvVariables.js';
import { createChatCompletion } from '../../utils/openaiAPI/createChatCompletion.js';
import ora from 'ora';

export type IMessages = Array<{
	content: string;
	role: 'user' | 'assistant';
}>

export class CreateChatCompletion extends Base {
	constructor(args: IConfigBase) {
		super(args);
	}

	public async run() {
		super.run();

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

		const spinner = ora('AI is thinking...').start();

		const { data } = await createChatCompletion({
			messages: messagesWithEnv,
		}).finally(() => {
			spinner.stop();
		});

		spinner.stop();

		if (!data) {
			process.exit(1);
		}

		if (this?.export?.response_content) {
			this.pipeline.env[this.export.response_content] = data.choices[0].message.content;
		}
	}
}
