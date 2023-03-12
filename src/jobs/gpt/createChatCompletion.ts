import axios from 'axios';
import { Base, IConfigBase } from '../base.js';
import { replaceEnvVariables } from '../../utils/replaceEnvVariables.js';
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
		const { messages } = this.with as { messages: IMessages };
		// 给 messages 中的 item 的content加上环境变量
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
		const spinner = ora('gitmoji AI is thinking...').start();

		const { data } = await axios.post('https://api.openai.com/v1/chat/completions', {
			model: "gpt-3.5-turbo",
			messages: messagesWithEnv,
		}, {
			headers: {
				'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
				'Content-Type': 'application/json'
			}
		}).finally(() => {
			spinner.stop();
		});

		if (this?.export?.response_content) {
			this.pipeline.env[this.export.response_content] = data.choices[0].message.content;
		}
	}
}
