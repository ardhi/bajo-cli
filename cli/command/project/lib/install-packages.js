import { installDependencies } from 'nypm'
import confirm from '@inquirer/confirm'
import fs from 'fs-extra'
import ora from 'ora'
import { __ } from '../../../lib/translate.js'

async function installPackages () {
  const cwd = process.cwd()
  const spinner = ora(__('Install dependencies')).start()
  const result = await installDependencies({ cwd, silent: false })
  if (result) spinner.succeed(__('Dependencies installed'))
  else {
    spinner.fail(__('Dependencies installation failed'))
    const answer = await confirm({
      message: __('Do you want to remove project directory?'),
      default: false
    })
    if (answer) {
      process.chdir('..')
      fs.removeSync(cwd)
      ora(__('Project directory removed')).succeed()
    }
    ora(__('Project creation canceled')).fail()
    process.exit(1)
  }
}

export default installPackages