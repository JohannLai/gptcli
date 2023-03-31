import { Base, IConfigBase } from './base.js';
import { getSetOutputFromLog } from '../utils/setOutput.js';

export class Script extends Base {
  constructor(args: IConfigBase) {
    super(args);
  }

  public async run() {
    if (!await super.run()) {
      return;
    }

    if (!this.script) {
      return;
    }

    const scripts = Array.isArray(this.script) ? this.script : [this.script];
    const script = scripts.join(' && ');

    const result = await this.execScript(script).catch(() => {
      process.exit(1);
    });

    if (result.code !== 0) {
      throw new Error(result.stderr);
    }

    const outputs = getSetOutputFromLog(result.stdout);

    Object.keys(outputs).forEach((key) => {
      this.pipeline.env[key] = outputs[key];
    });
  }
}
