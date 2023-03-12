import { Base, IConfigBase } from './base.js';
import { getOutput } from '../utils/set-output.js';

export class Script extends Base {
	constructor(args: IConfigBase) {
		super(args);
	}

	public async run() {
		super.run();

		if (!this.script) {
			return;
		}

		const scripts = Array.isArray(this.script) ? this.script : [this.script];

		for (const script of scripts) {
			const result = await this.execScript(script).catch(() => {
				process.exit(1);
			});

			if (result.code !== 0) {
				throw new Error(result.stderr);
			}

			const outputs = this.getOutput(result.stdout);

			// export outputs
			outputs.forEach((item) => {
				if (this.export && this.export[item.name]) {
					this.pipeline.env[this.export[item.name]] = item.value;
				}
			})

			console.log(result.stdout);
		}
	}

	private getOutput(stdout: string) {
		return getOutput(stdout);
	}
}
