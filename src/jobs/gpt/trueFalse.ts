import inquirer from 'inquirer';
import { Base, IConfigBase } from '../base.js';
import { replaceEnvVariables } from '../../utils/replaceEnvVariables.js';

export class TrueFalse extends Base {
	constructor(args: IConfigBase) {
		super(args);
	}

	public async run() {
		super.run();

		const { message } = this.with as {
			message: string,
		};

		const messageWithEnv = replaceEnvVariables(
			message, {
			...process.env,
			...this.pipeline.env,
		});

		const { data } = await inquirer.prompt({
			type: 'confirm',
			name: 'data',
			default: true,
			message: messageWithEnv,
		});

		if (this?.export?.answer) {
			this.pipeline.env[this.export.answer] = data;
		}
	}
}
