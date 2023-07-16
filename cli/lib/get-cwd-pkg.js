import getGlobalModuleDir from 'bajo/boot/helper/get-global-module-dir.js'
import pathResolve from 'bajo/boot/helper/path-resolve.js'
import isValidApp from 'bajo/boot/helper/is-valid-app.js'
import isValidPlugin from 'bajo/boot/helper/is-valid-plugin.js'
import { __, fatal } from './translate.js'
import fs from 'fs-extra'

function getCwdPkg ({ argv, type }) {
  const validator = type === 'app' ? isValidApp : isValidPlugin
  let cwd = pathResolve(process.cwd())
  if (!['.', './', '.\\', undefined].includes(argv.name)) cwd = getGlobalModuleDir(argv.name)
  if (!cwd) fatal(`Unknown bajo %s: '%s'. Try 'bajo %s list' to list all installed %s`, type, argv.name, type, type)
  if (!validator(cwd)) fatal(`Current directory is NOT a valid bajo %s, sorry!`, type)
  const pkg = fs.readJSONSync(`${cwd}/package.json`)
  return { cwd, pkg }
}

export default getCwdPkg
