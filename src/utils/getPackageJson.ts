import * as url from 'url'
import { readPackageUp } from 'read-pkg-up'

export const getPackageVersion = async () => {
  const dirname = url.fileURLToPath(new URL('.', import.meta.url))
  const pkg = await readPackageUp({ cwd: dirname })
  const packageJson = pkg?.packageJson
  if (!packageJson) {
    throw new Error('package.json not found')
  }

  return packageJson.version
}
