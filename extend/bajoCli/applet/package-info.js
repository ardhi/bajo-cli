import getNpmPkgInfo from '../../../cli/lib/get-npm-pkg-info.js'
import { input } from '@inquirer/prompts'

/**
 * @module Applet
 */

/**
 * Retrieve information about an npm package
 *
 * @memberof module:Applet
 * @name cli:packageInfo
 * @example
 * node index.js -a cli:packageInfo <package-name>
 */
async function packageInfo (path, ...args) {
  const { isEmpty, omit, get } = this.app.lib._
  const { writeOutput } = this
  let [pkg] = args
  if (isEmpty(pkg)) {
    pkg = await input({
      message: this.t('packageName'),
      validate: (item) => isEmpty(item) ? this.t('mustProvideValue') : true
    })
  }
  const spin = this.print.spinner().start('retrieving')
  const resp = await getNpmPkgInfo(pkg)
  if (!resp) {
    spin.fail('unknownPackage%s', pkg)
    if (!this.app.applet) return
  }
  spin.info('done')
  const omitted = get(this, 'app.argv._.omit.keys', ['readme', 'versions', 'time'])
  const result = omit(resp, omitted)
  await writeOutput(result, 'packageInfo')
  this.app.exit()
}

export default packageInfo
