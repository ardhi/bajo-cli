import getNpmPkgInfo from '../../bajo/method/get-npm-pkg-info.js'
import { input } from '@inquirer/prompts'

async function packageInfo (...args) {
  const { isEmpty, omit } = this.lib._
  const { getOutputFormat, writeOutput } = this
  const format = getOutputFormat()
  let [pkg] = args
  if (isEmpty(pkg)) {
    pkg = await input({
      message: this.print.write('Package name:'),
      validate: (item) => isEmpty(item) ? this.print.write('You must provide a valid value') : true
    })
  }
  const spin = this.print.spinner().start('Retrieving...')
  const resp = await getNpmPkgInfo(pkg)
  if (resp.status === 404) {
    spin.fail('Unknown package \'%s\'. Aborted!', pkg)
    if (!this.app.bajo.config.applet) return
  }
  if (resp.status !== 200) {
    spin.fail('Can\'t check \'%s\' against npm registry. Aborted!', pkg)
    if (!this.app.bajo.config.applet) return
  }
  spin.info('Done!')
  const omitted = ['readme', 'versions']
  const result = omit(await resp.json(), omitted)
  await writeOutput(result, 'packageInfo', format)
}

export default packageInfo
