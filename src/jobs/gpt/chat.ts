import inquirer from 'inquirer';
import chalk from 'chalk';
import { Base, IConfigBase } from '../base.js';
import { createChatCompletion } from '../../utils/openaiAPI/createChatCompletion.js';
import { startLoading, stopLoading } from '../../utils/loading.js';
import logUpdate from 'log-update';
import { getFreeOpenaiKey } from '../../utils/openaiAPI/getFreeOpenaiKey.js';

/**
 * chat with gpt
 * ask a question and get an answer , loop until you say "bye"
 **/
export class Chat extends Base {
  constructor(args: IConfigBase) {
    super(args);
  }

  public async run() {
    if (!await super.run()) {
      return;
    }

    const AIEmoji = '👽';
    const UserEmoji = '🫣';
    const welcomeMessage = chalk.green(`${AIEmoji}: Hi, I am ChatGpt, I can answer your questions. Ask me anything, or say "bye" to exit.`);
    console.log(welcomeMessage)

    // output messages
    const messages: string[] = [];

    const chatMessages: {
      content: string;
      role: 'user' | 'assistant';
    }[] = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { question } = await inquirer.prompt({
        type: 'input',
        name: 'question',
        message: `${UserEmoji}`,
      });

      if (question === 'bye') {
        console.log(chalk.green(`${AIEmoji}: Bye!`));
        break;
      }

      messages.push("");
      chatMessages.push({
        content: question,
        role: 'user',
      });

      startLoading('AI is thinking ...');
      const apiKey = this.pipeline.env.OPENAI_API_KEY || getFreeOpenaiKey();
      const currentMessage = await createChatCompletion({
        apiKey,
        messages: chatMessages,
        onMessage: (message) => {
          if (!message) {
            return;
          }
          stopLoading();
          logUpdate(chalk.green(`${AIEmoji}: ${message}`));
        }
      });

      if (!currentMessage) {
        chatMessages.push({
          content: currentMessage,
          role: 'assistant',
        });
      }

      logUpdate.done()
    }
  }
}
