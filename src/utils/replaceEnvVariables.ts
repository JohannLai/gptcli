export function replaceEnvVariables(str: string, env: { [key: string]: any }): string {
	// e.g. ${LOCALE} 和 $LOCALE
	const reg = /\${?(\w+)}?/g;
	return str.replace(reg, (match, variableName) => {
		return env[variableName] || "";
	});
}
