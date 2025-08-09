import path from 'path'
import fs from 'fs'
import pick from 'lodash-es/pick.js'
import isValidPlugin from './is-valid-plugin.js'
import isValidApp from './is-valid-app.js'
import readJson from './read-json.js'
import getNpmPkgInfo from './get-npm-pkg-info.js'
import { get, last, keys } from 'lodash-es'
import delay from 'delay'

export async function getLatestPlugin (name, registry, type) {
  const pkg = await getRemotePkg({ name, registry }, type)
  if (!pkg) return 'latest'
  return `^${pkg.version}`
}

export async function getRemotePkg (argv, type) {
  const resp = await getNpmPkgInfo(argv.name, argv.registry)
  if (!resp) return
  const ver = get(resp, 'dist-tags.latest', last(keys(resp.versions)))
  const pkg = resp.versions[ver] ?? {}
  const info = pick(pkg, ['name', 'description', 'version'])
  info.npmVersion = info.version
  info.versionMatch = true
  if (!type) return info
  const validator = type === 'app' ? isValidApp : isValidPlugin
  if (!validator(pkg, type)) return
  return info
}

async function getPkg (file, type, argv) {
  if (argv.remote) return await getRemotePkg(argv, type)
  const validator = type === 'app' ? isValidApp : isValidPlugin
  if (path.basename(file) !== 'package.json') file += '/package.json'
  if (!fs.existsSync(file)) return
  const pkg = readJson(file)
  if (!validator(pkg, type)) return
  const info = { name: pkg.name, version: pkg.version }
  if (argv.npmVersion) {
    const resp = await getNpmPkgInfo(pkg.name, argv.registry)
    info.npmVersion = resp ? get(resp, 'dist-tags.latest', last(keys(resp.versions))) : ''
    info.versionMatch = info.npmVersion === info.version
  } else {
    await delay(10)
  }
  info.description = pkg.description
  return info
}

export default getPkg
