// get key value from set-output
// "::set-output name={name}::{value}"

export function getSetOutputFromLog(log: string): Record<string, string> {
	const pattern = /::set-output name=(\w+)::(.+)/g;
	const result: Record<string, string> = {};
	let match;
	while ((match = pattern.exec(log))) {
		const key = match[1];
		const value = match[2];
		result[key] = value;
	}
	return result;
}
