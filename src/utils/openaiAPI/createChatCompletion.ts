import axios from "axios";
import chalk from "chalk";
import ora from 'ora';

export async function createChatCompletion(opt: any) {
	return await axios.post('https://api.openai.com/v1/chat/completions', {
		model: "gpt-3.5-turbo",
		...opt
	}, {
		headers: {
			'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
			'Content-Type': 'application/json'
		}
	}).then(res => res, (err) => {
		ora().fail("Open AI API Error");
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
	});
}
