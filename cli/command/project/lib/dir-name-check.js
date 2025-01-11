import validate from 'validate-npm-package-name'
import resolvePath from 'bajo/boot/class/bajo-core/method/resolve-path.js'
import isEmptyDir from 'bajo/boot/class/bajo-core/method/is-empty-dir.js'
import path from 'path'
import ora from 'ora'
import delay from 'delay'
import fs from 'fs-extra'
import { __ } from '../../../lib/translate.js'
import getNpmPkgInfo from '../../../../bajo/method/get-npm-pkg-info.js'

async function dirNameCheck (argv, cwd) {
  if (!cwd) cwd = resolvePath(process.cwd())
  if (argv.name === '.\\') argv.name = './'
  if (['.', './'].includes(argv.name)) {
    argv.name = path.basename(cwd)
  } else cwd = `${cwd}/${argv.name}`
  const spinner = ora(__('Checking name')).start()
  await delay(1000)
  const nameCheck = validate(argv.name)
  if (!nameCheck.validForNewPackages) {
    spinner.fail(__('Package name \'%s\' is not a valid npm package name. Aborted!', argv.name))
    process.kill(process.pid, 'SIGINT')
    return
  }
  if (argv.checkRemote) {
    try {
      const resp = await getNpmPkgInfo(argv.name)
      if (resp.status !== 404) {
        spinner.fail(__('Package name \'%s\' is already taken on npm registry. Aborted!', argv.name))
        process.kill(process.pid, 'SIGINT')
        return
      }
    } catch (err) {
      spinner.fail(__('Can\'t check \'%s\' against npm registry. Aborted!', argv.name))
      process.kill(process.pid, 'SIGINT')
      return
    }
  }
  if (fs.existsSync(cwd) && !(await isEmptyDir(cwd))) {
    spinner.fail(__('Dir \'%s\' is NOT empty. Aborted!', path.resolve(cwd)))
    process.kill(process.pid, 'SIGINT')
    return
  }
  spinner.succeed(__('Package name: %s', argv.name))
  return cwd
}

export default dirNameCheck
