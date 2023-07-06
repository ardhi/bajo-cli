import { installDependencies } from 'nypm'
import confirm from '@inquirer/confirm'
import fs from 'fs-extra'
import ora from 'ora'

async function installPackages () {
  const cwd = process.cwd()
  const spinner = ora('Install dependencies').start()
  const result = await installDependencies({ cwd, silent: false })
  if (result) spinner.succeed('Dependencies installed')
  else {
    spinner.fail('Dependencies installation failed')
    const answer = await confirm({
      message: 'Do you want to remove project directory?',
      default: false
    })
    if (answer) {
      process.chdir('..')
      fs.removeSync(cwd)
      ora('Project directory removed').succeed()
    }
    ora('Project creation canceled').fail()
    process.exit(1)
  }
}

export default installPackages