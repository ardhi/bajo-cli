import getGlobalModuleDir from './get-global-module-dir.js'
import resolvePath from 'aneka/src/resolve-path.js'
import { fatal, __ } from './translate.js'
import getPkg from './get-pkg.js'
import ora from 'ora'
import { getFiles } from '../command/plugin/list.js'
import listPackages from './list-packages.js'

async function getCwdPkg ({ argv, type }) {
  let cwd
  if (type === 'plugin') cwd = `${resolvePath(process.cwd())}/node_modules/${argv.name}`
  else cwd = `${resolvePath(process.cwd())}/${argv.name}`
  if (argv.global) cwd = getGlobalModuleDir(argv.name)
  if (!cwd) fatal('%s is either NOT found NOR a valid bajo %s, sorry!', argv.name, type)
  const spinner = ora(__('Getting info...')).start()
  let pkg = await getPkg(cwd, type, argv)
  if (type === 'app' && !pkg && !argv.global) {
    const files = await getFiles(argv, 'app', !argv.global)
    const coll = await listPackages(files, 'app', argv)
    const found = coll.find(item => item.name === argv.name)
    if (found) {
      cwd = `${resolvePath(process.cwd())}/${found.base}`
      pkg = await getPkg(cwd, type, argv)
    }
  }
  spinner.stop()
  if (!pkg) fatal('%s is either NOT found NOR a valid bajo %s, sorry!', argv.name, type)
  pkg.directory = cwd
  return { cwd, pkg }
}

export default getCwdPkg
