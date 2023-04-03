import clipboardy from "clipboardy"
import { replaceEnvVariables } from "../../utils/replaceEnvVariables.js";
import { Base, IConfigBase } from '../base.js';

/**
 * Copy text to clipboard
 * @example
 * {
 *  "name": "copyToClipboard",
 *  "with": {
 *    "text": "Hello world"
 *   }
 * }
 */
export class CopyToClipboard extends Base {
  constructor(args: IConfigBase) {
    super(args);
  }

  public async run() {
    if (!await super.run()) {
      return;
    }


    const { text } = this.with as {
      text: string,
    };

    const textWithEnv = replaceEnvVariables(
      text, {
        ...process.env,
        ...this.pipeline.env,
      });

    clipboardy.writeSync(textWithEnv);
  }
}
