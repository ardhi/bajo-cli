import getGlobalModuleDir from './get-global-module-dir.js'
import resolvePath from './resolve-path.js'
import isValidApp from './is-valid-app.js'
import isValidPlugin from './is-valid-plugin.js'
import { fatal } from './translate.js'
import fs from 'fs-extra'

function getCwdPkg ({ argv, type }) {
  const validator = type === 'main' ? isValidApp : isValidPlugin
  let cwd = resolvePath(process.cwd())
  if (!['.', './', '.\\', undefined].includes(argv.name)) cwd = getGlobalModuleDir(argv.name)
  if (!cwd) fatal('Unknown bajo %s: \'%s\'. Try \'bajo %s list\' to list all installed %s', type, argv.name, type, type)
  if (!validator(cwd)) fatal('Current directory is NOT a valid bajo %s, sorry!', type)
  const pkg = fs.readJSONSync(`${cwd}/package.json`)
  return { cwd, pkg }
}

export default getCwdPkg
