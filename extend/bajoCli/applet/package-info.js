import getNpmPkgInfo from '../../../cli/lib/get-npm-pkg-info.js'
import { input } from '@inquirer/prompts'

/**
 * @module Lib/Applet
 */

/**
 * Retrieve information about an npm package
 *
 * @async
 * @method
 * @memberof module:Lib/Applet
 * @param  {...any} args - Arguments to be passed to the function
 * @returns {Promise<void>} - Result of the function
 */
async function packageInfo (...args) {
  const { isEmpty, omit } = this.app.lib._
  const { writeOutput } = this
  let [pkg] = args
  if (isEmpty(pkg)) {
    pkg = await input({
      message: this.t('packageName'),
      validate: (item) => isEmpty(item) ? this.t('mustProvideValue') : true
    })
  }
  const spin = this.print.spinner().start('retreiving')
  const resp = await getNpmPkgInfo(pkg)
  if (!resp) {
    spin.fail('unknownPackage%s', pkg)
    if (!this.app.applet) return
  }
  spin.info('done')
  const omitted = ['readme', 'versions']
  const result = omit(resp, omitted)
  await writeOutput(result, 'packageInfo')
}

export default packageInfo
