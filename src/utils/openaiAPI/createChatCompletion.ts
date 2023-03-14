import axios from "axios";
import chalk from "chalk";
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser'
import ora from 'ora';
import { fetch, ProxyAgent } from 'undici'
import logUpdate from 'log-update';


// export async function createChatCompletion(opt: any) {
// 	return await axios.post('https://api.openai.com/v1/chat/completions', {
// 		model: "gpt-3.5-turbo",
// 		...opt
// 	}, {
// 		headers: {
// 			'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
// 			'Content-Type': 'application/json'
// 		}
// 	}).then(res => res, (err) => {
// 		ora().fail("Open AI API Error");
// 		console.error(chalk.red('Error:', err.response.data.error.message));
// 		console.error(chalk.reset(`
// 	Possible reasons:

// 	1. My OPENAI_API_KEY is expired, please contact me to charged it.
// 	   Or set your own OPENAI_API_KEY, You can get your OPENAI_API_KEY from https://beta.openai.com/account/api-keys

// 		e.g: gpt config user.OPENAI_API_KEY sk-xxx

// 	2. The OPENAI_API_KEY is not set, please set it first.
// 	3. OPENAI server is down, please try again later.You can check the status from https://status.openai.com/
// 	`));

// 		return err;
// 	});
// }


const parseOpenAIStream = (rawResponse: Response) => {
	const encoder = new TextEncoder()
	const decoder = new TextDecoder()

	const stream = new ReadableStream({
		async start(controller) {
			const streamParser = (event: ParsedEvent | ReconnectInterval) => {
				if (event.type === 'event') {
					const data = event.data
					if (data === '[DONE]') {
						controller.close()
						return
					}
					try {
						// response = {
						//   id: 'chatcmpl-6pULPSegWhFgi0XQ1DtgA3zTa1WR6',
						//   object: 'chat.completion.chunk',
						//   created: 1677729391,
						//   model: 'gpt-3.5-turbo-0301',
						//   choices: [
						//     { delta: { content: '你' }, index: 0, finish_reason: null }
						//   ],
						// }
						const json = JSON.parse(data)

						const text = json.choices[0].delta?.content || ''

						const queue = encoder.encode(text)
						controller.enqueue(queue)
					} catch (e) {
						controller.error(e)
					}
				}
			}

			const parser = createParser(streamParser)
			for await (const chunk of rawResponse.body as any) {
				parser.feed(decoder.decode(chunk))
			}
		},
	})

	return stream
}

const BASE_URL = 'https://api.openai.com'
export async function createChatCompletion(opt: any) {
	const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
		},
		method: 'POST',
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			...opt,
			stream: true,
		}),
	}) as unknown as Response;

	const streamRes = new Response(parseOpenAIStream(response))
	if (!response.ok) {
		throw new Error(response.statusText)
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
				logUpdate(chalk.green('❯', currentMessage));
			}
		}

		done = readerDone
	}

	return currentMessage;
}
