import chalk from "chalk";
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser'
import { fetch, ProxyAgent } from 'undici'
import { stopLoading } from "../loading.js";
import { OPENAI_BASE_URL } from "../../constants.js";

const parseOpenAIStream = (rawResponse: Response) => {
	const encoder = new TextEncoder()
	const decoder = new TextDecoder()

	const stream = new ReadableStream({
		async start(controller) {
			const streamParser = (event: ParsedEvent | ReconnectInterval) => {
				if (event.type === 'event') {
					stopLoading();

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

export async function createChatCompletion(options: { [x: string]: any; messages?: { content: string; role: "user" | "assistant"; }[]; onMessage: (data: string) => void }) {
	const { onMessage, ...fetchOptions } = options

	const response = await fetch(`${OPENAI_BASE_URL}/v1/chat/completions`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
		},
		method: 'POST',
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			...fetchOptions,
			stream: true,
		}),
	}).catch(err => {
		console.log(chalk.red(`Error: request openai error, ${err.message}`))
		return err
	}) as unknown as Response;

	const streamRes = new Response(parseOpenAIStream(response))
	if (!response?.ok) {
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
