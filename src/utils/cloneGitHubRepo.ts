import { exec } from 'child_process';
import { PLUGINS_DIR } from '../constants.js';
import fs from 'fs/promises';
import util from 'util';

const execPromise = util.promisify(exec);

/**
 * Clone a GitHub repository to ~/.config/gpt-cli/plugins directory
 * @param {string} repoPath - GitHub repository path, e.g. "owner/repo"
 * @returns {string} - The path of the cloned repository
 */
export async function cloneGitHubRepo(repoPath: string) {
	if (!repoPath) throw new Error('repoPath is required');
	const repoUrl = `https://github.com/${repoPath}.git`;

	await fs.mkdir(PLUGINS_DIR, { recursive: true });
	await execPromise(`git clone ${repoUrl} ${PLUGINS_DIR}`);

	return `${PLUGINS_DIR}/${repoPath.split('/')[1]}`
}
