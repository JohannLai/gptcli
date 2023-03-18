import chalk from "chalk";
import { fetch, ProxyAgent } from 'undici'
import { OPENAI_BASE_URL } from "../../constants.js";
import { parseOpenAIStream } from "./parseOpenAIStream.js";


export async function createChatCompletion(options: { [x: string]: any; messages?: { content: string; role: "user" | "assistant"; }[]; onMessage: (data: string) => void }) {
	const { apiKey, onMessage, ...fetchOptions } = options;

	// process on exit
	process.on('exit', (err) => {
		console.log(chalk.red(`Error: request openai error, ${err}`))
		process.exit(1)
	})

	const response = await fetch(`${OPENAI_BASE_URL}/v1/chat/completions`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		method: 'POST',
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			...fetchOptions,
			stream: true,
		}),
	}).catch(err => {
		console.log(chalk.red(`Error: request openai error, ${err.message}`))
		throw err
	}) as unknown as Response;

	const streamRes = new Response(parseOpenAIStream(response))

	if (!response?.ok) {
		console.log(chalk.red(`Error: request openai error, ${response.statusText}`))
		process.exit(1)
	}

	const data = streamRes.body;

	if (!data) {
		throw new Error('No data')
	}

	const reader = data.getReader()
	const decoder = new TextDecoder('utf-8')
	let done = false

	let currentMessage = '';

	while (!done) {
		const { value, done: readerDone } = await reader.read()
		if (value) {
			const char = decoder.decode(value)
			if (char === '\n' && currentMessage.endsWith('\n')) {
				continue
			}

			if (char) {
				currentMessage += char;
				onMessage(currentMessage);
			}
		}

		done = readerDone
	}

	return currentMessage;
}
