import confirm from '@inquirer/confirm'
import fs from 'fs-extra'
import ora from 'ora'
import { __ } from '../../../lib/translate.js'

/**
 * Cancel project creation and optionally remove the project directory.
 *
 * @async
 * @memberof module:CLI/Command/Project
 * @returns {Promise<void>}
 */
async function cancelProject () {
  const cwd = process.cwd()
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
  process.kill(process.pid, 'SIGINT')
}

export default cancelProject
