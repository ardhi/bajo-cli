import getNpmPkgInfo from '../../bajo/helper/get-npm-pkg-info.js'
import { input } from '@inquirer/prompts'

async function packageInfo ({ path, args }) {
  const { getConfig, importPkg, saveAsDownload, print, spinner } = this.bajo.helper
  const { isEmpty, omit } = this.bajo.helper._
  const { prettyPrint } = this.bajoCli.helper
  const stripAnsi = await importPkg('bajoCli:strip-ansi')
  let [pkg] = args
  if (isEmpty(pkg)) {
    pkg = await input({
      message: print.__('Package name:'),
      validate: (item) => isEmpty(item) ? print.__('You must provide a valid value') : true
    })
  }
  const config = getConfig()
  const spin = spinner().start('Retrieving...')
  const resp = await getNpmPkgInfo(pkg)
  if (resp.status === 404) {
    spin.fail('Unknown package \'%s\'. Aborted!', pkg)
    if (!config.tool) return
  }
  if (resp.status !== 200) {
    spin.fail('Can\'t check \'%s\' against npm registry. Aborted!', pkg)
    if (!config.tool) return
  }
  const omitted = config.full ? [] : ['readme', 'versions']
  let result = omit(await resp.json(), omitted)
  result = config.pretty ? (await prettyPrint(result)) : JSON.stringify(result, null, 2)
  if (config.save) {
    const file = `/${path}/${pkg}.${config.pretty ? 'txt' : 'json'}`
    const fullPath = await saveAsDownload(file, stripAnsi(result), 'bajoCli')
    spin.succeed('Saved as \'%s\'', fullPath, { skipSilent: true })
  } else {
    spin.succeed('Done!')
    console.log(result)
  }
}

export default packageInfo
