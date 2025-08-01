import getGlobalModuleDir from './get-global-module-dir.js'
import resolvePath from './resolve-path.js'
import { fatal } from './translate.js'
import getPkg from './get-pkg.js'

async function getCwdPkg ({ argv, type }) {
  let cwd = resolvePath(process.cwd())
  if (!['.', './', '.\\', undefined].includes(argv.name)) cwd = getGlobalModuleDir(argv.name)
  if (!cwd) fatal('Unknown bajo %s: \'%s\'. Try \'bajo %s list\' to list all installed %s', type, argv.name, type, type)
  const pkg = await getPkg(cwd, type, argv)
  if (!pkg) fatal('%s is NOT a valid bajo %s, sorry!', argv.name, type)
  pkg.directory = cwd
  return { cwd, pkg }
}

export default getCwdPkg
