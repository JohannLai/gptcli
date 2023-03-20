import ora, { Ora } from 'ora';

let spinner: Ora;

export function startLoading(text: string) {
  spinner = ora(text).start();
}

export function stopLoading() {
  spinner && spinner.stop();
}
