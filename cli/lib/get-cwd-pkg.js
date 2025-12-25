import getGlobalModuleDir from './get-global-module-dir.js'
import resolvePath from 'aneka/src/resolve-path.js'
import { fatal, __ } from './translate.js'
import getPkg from './get-pkg.js'
import ora from 'ora'

async function getCwdPkg ({ argv, type }) {
  let cwd = `${resolvePath(process.cwd())}/node_modules/${argv.name}`
  if (argv.global) cwd = getGlobalModuleDir(argv.name)
  const spinner = ora(__('Getting info...')).start()
  const pkg = await getPkg(cwd, type, argv)
  spinner.stop()
  if (!pkg) fatal('%s is either NOT found NOR a valid bajo %s, sorry!', argv.name, type)
  pkg.directory = cwd
  return { cwd, pkg }
}

export default getCwdPkg
