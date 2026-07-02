import { camelCase, upperFirst } from 'lodash-es'
import fs from 'fs-extra'

/**
 * Modify the plugin factory file with the provided arguments.
 *
 * @async
 * @memberof module:CLI/Command/Project
 * @param {object} options - Parameters
 * @param {string} options.cwd - Current working directory
 * @param {object} options.argv - Command line arguments
 * @param {string} options.argv.name - Plugin name
 * @returns {Promise<void>}
 */
async function modifyPluginFactory (options) {
  const { cwd, argv } = options
  const file = `${cwd}/index.js`
  let content = fs.readFileSync(file, 'utf8')
  content = content.replaceAll('{name}', upperFirst(camelCase(argv.name)))
  fs.writeFileSync(file, content, 'utf8')
}

export default modifyPluginFactory
