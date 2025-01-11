import { installDependencies } from 'nypm'
import ora from 'ora'
import cancelProject from './cancel-project.js'
import { __ } from '../../../lib/translate.js'

async function installPackages () {
  const cwd = process.cwd()
  const spinner = ora(__('Install dependencies')).start()
  try {
    await installDependencies({ cwd, silent: false })
    spinner.succeed(__('Dependencies installed'))
  } catch (err) {
    spinner.fail(__('Error: ' + err.message))
    await cancelProject()
  }
}

export default installPackages
