// get key value from set-output
// "::set-output name={name}::{value} name={name}::{value} "

export function getOutput(str: string): {
	name: string;
	value: string;
}[] {
	const reg = /::set-output name=(\w+)::(\w+)/g;
	const result = str.match(reg);
	if (result) {
		return result.map((item) => {
			const [name, value] = item.split('::');
			return {
				name,
				value,
			};
		});
	}
	return [];
}
