import path from 'path'
import ora from 'ora'
import listTpl from '../tpl/list-tpl.js'
import { __ } from '../../../lib/translate.js'

/**
 * Check if the specified template exists.
 *
 * @async
 * @memberof module:CLI/Command/Project
 * @param {object} options - Parameters
 * @param {string} options.type - Template type
 * @param {object} options.argv - Command line arguments
 * @param {string} options.argv.tpl - Template name
 * @returns {Promise<string|undefined>} - Template directory or undefined if not found
 */
async function tplCheck (options) {
  const { type, argv } = options
  const dirs = await listTpl(type)
  let tplDir
  for (const d of dirs) {
    if (path.basename(d) === argv.tpl) {
      tplDir = d
      break
    }
  }
  if (!tplDir) {
    ora(__('Unknown app template \'%s\'. Type: \'bajo project templates %s\' for valid %s templates', argv.tpl, type, type)).fail()
    process.kill(process.pid, 'SIGINT')
    return
  }
  return tplDir
}

export default tplCheck
