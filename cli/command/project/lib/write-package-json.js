import fs from 'fs-extra'
import ora from 'ora'
import delay from 'delay'
import { __ } from '../../../lib/translate.js'

/**
 * Write the package.json file with the provided package information.
 *
 * @async
 * @memberof module:CLI/Command/Project
 * @param {object} options - Parameters
 * @param {string} options.cwd - Current working directory
 * @param {object} options.pkg - Package information
 * @param {object} options.argv - Command line arguments
 * @returns {Promise<void>}
 */
async function writePackageJson (options) {
  const { cwd, pkg } = options
  const spinner = ora(__('Write package.json')).start()
  await delay(1000)
  fs.writeJSONSync(`${cwd}/package.json`, pkg, { spaces: 2 })
  spinner.succeed()
}

export default writePackageJson
