import chalk from "chalk";
import { fetch, Response, ProxyAgent } from 'undici'
import { OPENAI_BASE_URL } from "../../constants.js";
import { parseOpenAIStream } from "./parseOpenAIStream.js";
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser'
import { streamAsyncIterable } from './stream-async-iterable.js'

export async function createChatCompletion(options: { [x: string]: any; messages?: { content: string; role: "user" | "assistant"; }[]; onMessage: (data: string) => void }) {
  const { apiKey, onMessage, ...fetchOptions } = options;

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
  });

  // const streamRes = new Response(parseOpenAIStream(response))

  if (!response?.ok) {
    console.log(chalk.red(`Error: request openai error, ${response.statusText}`))
    process.exit(1)
  }

  if (!response.body) {
    throw new Error('No data')
  }

  let currentMessage = '';

  const parser = createParser((event) => {
    if (event.type === 'event') {
      const data = event.data
      if (data === '[DONE]') {
        return
      }

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

      currentMessage += text;

      onMessage(currentMessage)
    }
  })

  for await (const chunk of response.body as any) {
    const decoder = new TextDecoder('utf-8')
    parser.feed(decoder.decode(chunk))
  }

  return currentMessage;
}
