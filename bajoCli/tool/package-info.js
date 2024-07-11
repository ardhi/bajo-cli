import getNpmPkgInfo from '../../bajo/method/get-npm-pkg-info.js'
import { input } from '@inquirer/prompts'

async function packageInfo ({ path, args }) {
  const { importPkg, saveAsDownload, print, spinner } = this.bajo
  const { isEmpty, omit } = this.bajo.lib._
  const stripAnsi = await importPkg('bajoCli:strip-ansi')
  let [pkg] = args
  if (isEmpty(pkg)) {
    pkg = await input({
      message: print.__('Package name:'),
      validate: (item) => isEmpty(item) ? print.__('You must provide a valid value') : true
    })
  }
  const spin = spinner().start('Retrieving...')
  const resp = await getNpmPkgInfo(pkg)
  if (resp.status === 404) {
    spin.fail('Unknown package \'%s\'. Aborted!', pkg)
    if (!this.app.bajo.config.toolMode) return
  }
  if (resp.status !== 200) {
    spin.fail('Can\'t check \'%s\' against npm registry. Aborted!', pkg)
    if (!this.app.bajo.config.toolMode) return
  }
  const omitted = ['readme', 'versions']
  let result = omit(await resp.json(), omitted)
  result = this.app.bajo.config.pretty ? (await this.prettyPrint(result)) : JSON.stringify(result, null, 2)
  if (this.app.bajo.config.save) {
    const file = `/${path}/${pkg}.${this.app.bajo.config.pretty ? 'txt' : 'json'}`
    const fullPath = await saveAsDownload(file, stripAnsi(result), 'bajoCli')
    spin.succeed('Saved as \'%s\'', fullPath, { skipSilent: true })
  } else {
    spin.succeed('Done!')
    console.log(result)
  }
}

export default packageInfo
