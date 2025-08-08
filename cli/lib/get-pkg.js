import path from 'path'
import fs from 'fs'
import isValidPlugin from './is-valid-plugin.js'
import isValidApp from './is-valid-app.js'
import readJson from './read-json.js'
import getNpmPkgInfo from './get-npm-pkg-info.js'
import { get, last, keys } from 'lodash-es'
import delay from 'delay'

async function getPkg (file, type, argv) {
  const validator = type === 'app' ? isValidApp : isValidPlugin
  if (type === 'plugin' && path.basename(file) !== 'package.json') file += '/package.json'
  if (!fs.existsSync(file)) return
  const pkg = readJson(file)
  if (!validator(pkg, type)) return
  const info = { name: pkg.name, version: pkg.version }
  if (argv.npmVersion) {
    const resp = await getNpmPkgInfo(pkg.name, argv.registry)
    info.npmVersion = resp ? get(resp, 'dist-tags.latest', last(keys(resp.versions))) : ''
    info.match = info.npmVersion === info.version
  } else {
    await delay(10)
  }
  info.description = pkg.description
  return info
}

export default getPkg
