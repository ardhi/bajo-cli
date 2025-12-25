import validate from 'validate-npm-package-name'
import resolvePath from 'aneka/src/resolve-path.js'
import isEmptyDir from '../../../lib/is-empty-dir.js'
import path from 'path'
import ora from 'ora'
import delay from 'delay'
import fs from 'fs-extra'
import { __ } from '../../../lib/translate.js'
import getNpmPkgInfo from '../../../lib/get-npm-pkg-info.js'

async function dirNameCheck (argv, cwd) {
  // check name
  const spinner = ora(__('Checking name')).start()
  await delay(1000)
  const nameCheck = validate(argv.name)
  if (!nameCheck.validForNewPackages) {
    spinner.fail(__('Package name \'%s\' is not a valid npm package name. Aborted!', argv.name))
    process.kill(process.pid, 'SIGINT')
    return
  }
  if (argv.registry) argv.checkNpm = true
  if (argv.checkNpm) {
    try {
      const resp = await getNpmPkgInfo(argv.name, argv.registry)
      if (resp && resp.status !== 404) {
        spinner.fail(__('Package name \'%s\' is already taken on npm registry. Aborted!', argv.name))
        process.kill(process.pid, 'SIGINT')
        return
      }
    } catch (err) {
      spinner.fail(__('Can\'t check \'%s\' against npm registry: %s. Aborted!', argv.name, err.message))
      process.kill(process.pid, 'SIGINT')
      return
    }
  }
  // check dir
  if (!cwd) cwd = resolvePath(process.cwd())
  const parts = argv.name.split('/')
  cwd = parts.length === 1 ? `${cwd}/${argv.name}` : `${cwd}/${parts[0].replace('@', '')}-${parts[1]}`
  if (argv.useCwd) cwd = resolvePath(process.cwd())
  if (fs.existsSync(cwd) && !(await isEmptyDir(cwd))) {
    spinner.fail(__('Directory \'%s\' is NOT empty. Aborted!', path.resolve(cwd)))
    process.kill(process.pid, 'SIGINT')
    return
  }
  spinner.succeed(__('Package name: %s', argv.name))
  return cwd
}

export default dirNameCheck
