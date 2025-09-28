import getNpmPkgInfo from '../../../cli/lib/get-npm-pkg-info.js'
import { input } from '@inquirer/prompts'

async function packageInfo (...args) {
  const { isEmpty, omit } = this.app.lib._
  const { writeOutput } = this
  let [pkg] = args
  if (isEmpty(pkg)) {
    pkg = await input({
      message: this.t('Package name:'),
      validate: (item) => isEmpty(item) ? this.t('You must provide a valid value') : true
    })
  }
  const spin = this.print.spinner().start('Retrieving...')
  const resp = await getNpmPkgInfo(pkg)
  if (!resp) {
    spin.fail('Unknown package \'%s\'. Aborted!', pkg)
    if (!this.app.bajo.config.applet) return
  }
  spin.info('Done!')
  const omitted = ['readme', 'versions']
  const result = omit(resp, omitted)
  await writeOutput(result, 'packageInfo')
}

export default packageInfo
