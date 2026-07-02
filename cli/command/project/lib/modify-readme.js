import fs from 'fs-extra'

/**
 * Modify the README.md file with the provided arguments.
 *
 * @async
 * @memberof module:CLI/Command/Project
 * @param {object} options - Parameters
 * @param {string} options.cwd - Current working directory
 * @param {object} options.argv - Command line arguments
 * @param {string} options.argv.name - Project name
 * @returns {Promise<void>}
 */
async function modifyReadme (options) {
  const { cwd, argv } = options
  const file = `${cwd}/README.md`
  let content = fs.readFileSync(file, 'utf8')
  content = content.replaceAll('{name}', argv.name)
  fs.writeFileSync(file, content, 'utf8')
}

export default modifyReadme
