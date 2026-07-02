import fs from 'fs-extra'
import ora from 'ora'
import delay from 'delay'
import { __ } from '../../../lib/translate.js'
import modifyLicense from './modify-license.js'

/**
 * Copy the root files of the project to the target directory and modify the license.
 *
 * @async
 * @memberof module:CLI/Command/Project
 * @param {object} options - Parameters
 * @param {object} options.pkg - Package information
 * @param {string} options.cwd - Current working directory
 * @param {string} options.tplDir - Template directory
 * @param {Array<string>} options.files - Files to copy
 * @returns {Promise<void>}
 */
async function copyRootFiles (options) {
  const { pkg, cwd, tplDir, files } = options
  const spinner = ora(__('Copy project files')).start()
  await delay(1000)
  for (const f of files) {
    let [src, dest] = f.split(':')
    if (!dest) dest = src
    try {
      fs.copySync(`${tplDir}/skel/${src}`, `${cwd}/${dest}`)
    } catch (err) {
    }
  }
  try {
    fs.copySync(`${tplDir}/../../license/${pkg.license}`, `${cwd}/LICENSE.md`)
    await modifyLicense({ cwd, pkg })
  } catch (err) {}
  spinner.succeed()
}

export default copyRootFiles
