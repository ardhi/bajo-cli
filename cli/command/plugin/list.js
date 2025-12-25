import fastGlob from 'fast-glob'
import getGlobalModuleDir from '../../lib/get-global-module-dir.js'
import epilog from '../../lib/epilog.js'
import listPackages from '../../lib/list-packages.js'
import resolvePath from 'aneka/src/resolve-path.js'
import { isValid } from '../../lib/is-valid-plugin.js'
import { fatal, __ } from '../../lib/translate.js'
import { horizontal } from '../../lib/create-table.js'
import { globalScope, npmVersion, onlyUnmatch, registry } from '../../lib/option.js'

export async function getFiles (argv, type, checkRoot) {
  let files = []
  if (argv.global) {
    const nodeModules = getGlobalModuleDir(null, false)
    const pattern = [`${nodeModules}/*/package.json`, `${nodeModules}/@*/*/package.json`]
    files = await fastGlob(pattern)
  } else {
    const cwd = resolvePath(process.cwd())
    const name = __('Current directory')
    let pattern
    if (checkRoot) {
      pattern = [`${cwd}/*/package.json`]
    } else {
      if (!isValid(cwd, type)) fatal('%s is NOT a valid bajo %s, sorry!', name, type)
      pattern = [`${cwd}/node_modules/*/package.json`, `${cwd}/node_modules/@*/*/package.json`]
    }
    files = await fastGlob(pattern)
  }
  if (files.length === 0) fatal('No %ss detected!', 'plugin')
  return files
}

const list = {
  command: 'list',
  aliases: ['l'],
  describe: __('List all installed plugins'),
  builder (yargs) {
    globalScope(yargs)
    npmVersion(yargs)
    registry(yargs)
    onlyUnmatch(yargs)
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const files = await getFiles(argv, 'plugin')
    const picked = ['name', 'version', 'npmVersion', 'versionMatch', 'description']
    const coll = await listPackages(files, 'plugin', argv, picked)
    horizontal(coll)
  }
}

export default list
