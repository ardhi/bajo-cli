import fs from 'fs-extra'

/**
 * Modify the LICENSE.md file with the author's name and the current year.
 *
 * @async
 * @memberof module:CLI/Command/Project
 * @param {object} options - Parameters
 * @param {string} options.cwd - Current working directory
 * @param {object} options.pkg - Package information
 * @param {string} options.pkg.author - Author's name
 * @returns {Promise<void>}
 */
async function modifyLicense (options) {
  const { cwd, pkg } = options
  const file = `${cwd}/LICENSE.md`
  let content = fs.readFileSync(file, 'utf8')
  content = content.replaceAll('{author}', pkg.author)
    .replaceAll('{year}', (new Date()).getFullYear())
  fs.writeFileSync(file, content, 'utf8')
}

export default modifyLicense
