import chalk from "chalk";
import { fetch } from 'undici'
import { OPENAI_DOMAIN } from "../../constants.js";
import { createParser } from 'eventsource-parser'

export async function createChatCompletion(options: { [x: string]: any; messages?: { content: string; role: "user" | "assistant"; }[]; onMessage: (data: string) => void }) {
  const { apiKey, onMessage, ...fetchOptions } = options;
  const authKey = apiKey ? `Bearer ${apiKey}` : '';

  const response = await fetch(`${OPENAI_DOMAIN}/v1/chat/completions`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: authKey,
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

  if (!response?.ok) {
    console.log(chalk.red(`Error: request openai error, ${response.statusText}(${response.status}), May be more than the longest tokens`))
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
