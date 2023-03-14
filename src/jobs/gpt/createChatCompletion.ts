import axios from 'axios';
import { Base, IConfigBase } from '../base.js';
import { replaceEnvVariables } from '../../utils/replaceEnvVariables.js';
import ora from 'ora';
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
		super.run();

		const { messages } = this.with as { messages: IMessages };
		// 给 messages 中的 item 的 content 加上环境变量
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

		// show loading
		const spinner = ora('AI is thinking...').start();

		const { data } = await axios.post('https://api.openai.com/v1/chat/completions', {
			model: "gpt-3.5-turbo",
			messages: messagesWithEnv,
		}, {
			headers: {
				'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
				'Content-Type': 'application/json'
			}
		}).then(res => res, (err) => {
			spinner.fail("gitmoji AI is thinking failed");
			console.error(chalk.red('Error:', err.response.data.error.message));
			console.error(chalk.reset(`
	Possible reasons:

	1. My OPENAI_API_KEY is expired, please contact me to charged it.
	   Or set your own OPENAI_API_KEY, You can get your OPENAI_API_KEY from https://beta.openai.com/account/api-keys

		e.g: gpt config user.OPENAI_API_KEY sk - xxx

	2. The OPENAI_API_KEY is not set, please set it first.
	3. OPENAI server is down, please try again later.You can check the status from https://status.openai.com/
	`));
			return err;
		}).finally(() => {
			spinner.stop();
		});

		if (!data) {
			process.exit(1);
		}

		if (this?.export?.response_content) {
			this.pipeline.env[this.export.response_content] = data.choices[0].message.content;
		}
	}
}
