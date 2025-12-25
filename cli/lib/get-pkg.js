import path from 'path'
import fs from 'fs'
import isValidPlugin from './is-valid-plugin.js'
import isValidApp from './is-valid-app.js'
import readJson from './read-json.js'
import getNpmPkgInfo from './get-npm-pkg-info.js'
import { get, last, keys } from 'lodash-es'
import delay from 'delay'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'

dayjs.extend(relativeTime)

export async function getLatestPlugin (name, registry, type) {
  const pkg = await getRemotePkg({ name, registry }, type)
  if (!pkg) return 'latest'
  return `^${pkg.version}`
}

export async function getRemotePkg (argv, type, original) {
  const resp = await getNpmPkgInfo(argv.name, argv.registry)
  if (!resp) return
  const ver = get(resp, 'dist-tags.latest', last(keys(resp.versions)))
  const pkg = resp.versions[ver] ?? {}
  pkg.modified = dayjs(resp.time.modified).fromNow()
  if (original) return pkg
  pkg.npmVersion = pkg.version
  pkg.versionMatch = true
  if (!type) return pkg
  const validator = type === 'app' ? isValidApp : isValidPlugin
  if (!validator(pkg, type)) return
  return pkg
}

async function getPkg (file, type, argv) {
  if (argv.remote) return await getRemotePkg(argv, type)
  const validator = type === 'app' ? isValidApp : isValidPlugin
  if (path.basename(file) !== 'package.json') file += '/package.json'
  if (!fs.existsSync(file)) return
  const pkg = readJson(file)
  if (!validator(pkg, type)) return
  if (argv.npmVersion) {
    const resp = await getNpmPkgInfo(pkg.name, argv.registry)
    pkg.npmVersion = resp ? get(resp, 'dist-tags.latest', last(keys(resp.versions))) : ''
    pkg.versionMatch = pkg.npmVersion === pkg.version
  } else {
    await delay(10)
  }
  return pkg
}

export default getPkg
