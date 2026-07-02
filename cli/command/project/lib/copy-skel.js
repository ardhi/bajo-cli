import fastGlob from 'fast-glob'
import fs from 'fs-extra'
import path from 'path'
import ora from 'ora'
import delay from 'delay'
import { __ } from '../../../lib/translate.js'

/**
 * Copy the project skeleton to the target directory.
 *
 * @async
 * @memberof module:CLI/Command/Project
 * @param {object} options - Parameters
 * @param {string} options.cwd - Current working directory
 * @param {string} options.tplDir - Template directory
 * @returns {Promise<void>}
 */
async function copySkel (options) {
  const { cwd, tplDir } = options
  const spinner = ora(__('Copy project skeleton')).start()
  await delay(1000)
  const dirs = await fastGlob(`${tplDir}/skel/*`, { onlyDirectories: true })
  for (const d of dirs) {
    try {
      const base = path.basename(d)
      fs.copySync(d, `${cwd}/${base}`)
    } catch (err) {}
  }
  spinner.succeed()
}

export default copySkel
