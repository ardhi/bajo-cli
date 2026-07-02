import fs from 'fs-extra'
import ora from 'ora'
import delay from 'delay'
import { __ } from '../../../lib/translate.js'

/**
 * Ensure the project directory exists and change the current working directory to it.
 *
 * @async
 * @memberof module:CLI/Command/Project
 * @param {string} cwd - Current working directory
 * @returns {Promise<void>}
 */
async function ensureDir (cwd) {
  const spinner = ora(__('Ensure project dir')).start()
  await delay(1000)
  fs.ensureDirSync(cwd)
  process.chdir(cwd)
  spinner.succeed()
}

export default ensureDir
