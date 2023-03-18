export function replaceEnvVariables(str: string, env: { [key: string]: any }): string {
	// e.g. ${LOCALE} 和 $LOCALE
	const reg = /\${?(\w+)}?/g;
	return str.replace(reg, (match, variableName) => {
		// if env[variableName] is empty string "", return '""'
		if (env[variableName] === '') {
			return '""';
		}
		return env[variableName];
	});
}
