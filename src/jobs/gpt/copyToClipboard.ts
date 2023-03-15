import clipboardy from "clipboardy"
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
		super.run();

		const { text } = this.with as {
			text: string,
		};

		clipboardy.writeSync(text);
	}
}
