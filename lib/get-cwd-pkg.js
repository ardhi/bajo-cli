import getGlobalModuleDir from 'bajo/boot/helper/get-global-module-dir.js'
import pathResolve from 'bajo/boot/helper/path-resolve.js'
import isValidApp from 'bajo/boot/helper/is-valid-app.js'
import isValidPlugin from 'bajo/boot/helper/is-valid-plugin.js'
import error from 'bajo/boot/helper/error.js'
import fs from 'fs-extra'

function getCwdPkg ({ argv, type }) {
  const validator = type === 'app' ? isValidApp : isValidPlugin
  let cwd = pathResolve(process.cwd())
  if (!['.', './', '.\\', undefined].includes(argv.name)) cwd = getGlobalModuleDir(argv.name)
  if (!cwd) throw error(`Unknown bajo ${type}: '${argv.name}'. Try 'bajo ${type} list' to list all installed ${type}.`, '><')
  if (!validator(cwd)) throw error(`Current directory is NOT a valid bajo ${type}, sorry!`, '><')
  const pkg = fs.readJSONSync(`${cwd}/package.json`)
  return { cwd, pkg }
}

export default getCwdPkg
