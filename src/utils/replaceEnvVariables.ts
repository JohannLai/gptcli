export function replaceEnvVariables(str: string, env: { [key: string]: string }): string {
	const reg = /\$(\w+)/g;
	return str.replace(reg, (match, variableName) => {
		return env[variableName];
	});
}
