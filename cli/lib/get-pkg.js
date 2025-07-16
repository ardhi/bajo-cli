import path from 'path'
import isValidPlugin from './is-valid-plugin.js'
import isValidApp from './is-valid-app.js'
import readJson from './read-json.js'
import getNpmPkgInfo from './get-npm-pkg-info.js'
import { get, last, keys } from 'lodash-es'
import delay from 'delay'

async function getPkg (file, type, npmLastVersion) {
  const validator = type === 'app' ? isValidApp : isValidPlugin
  if (type === 'plugin' && path.basename !== 'package.json') file += '/package.json'
  const pkg = readJson(file)
  if (!validator(pkg, type)) return
  const info = { name: pkg.name, version: pkg.version }
  if (npmLastVersion) {
    const resp = await getNpmPkgInfo(pkg.name)
    if (resp.ok) {
      const result = await resp.json()
      info.npmVersion = get(result, 'dist-tags.latest', last(keys(result.versions)))
    }
  } else {
    await delay(20)
  }
  info.description = pkg.description
  return info
}

export default getPkg
