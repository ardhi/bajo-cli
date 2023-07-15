import getNpmPkgInfo from '../../bajo/helper/get-npm-pkg-info.js'
import { input } from '@inquirer/prompts'

async function packageInfo (path, args) {
  const { getConfig, importPkg, saveAsDownload, print } = this.bajo.helper
  const { prettyPrint } = this.bajoCli.helper
  const [_, stripAnsi] = await importPkg('lodash::bajo', 'strip-ansi::bajo-cli')
  let [pkg] = args
  if (_.isEmpty(pkg)) {
    pkg = await input({
      message: print.format('Package name:'),
      validate: (item) => _.isEmpty(item) ? print.format('You must provide a valid value') : true
    })
  }
  const config = getConfig()
  const spinner = print.bora('Retrieving...').start()
  const resp = await getNpmPkgInfo(pkg)
  if (resp.status === 404) spinner.fatal(`Unknown package '%s'. Aborted!`, pkg)
  if (resp.status !== 200) spinner.fatal(`Can't check '%s' against npm registry. Aborted!`, pkg)
  const omitted = config.full ? [] : ['readme', 'versions']
  let result = _.omit(await resp.json(), omitted)
  result = config.pretty ? (await prettyPrint(result)) : JSON.stringify(result, null, 2)
  if (config.save) {
    const file = `/${path}/${pkg}.${config.pretty ? 'txt' : 'json'}`
    const fullPath = await saveAsDownload(file, stripAnsi(result), 'bajoCli')
    spinner.succeed(`Saved as '%s'`, fullPath, { skipSilent: true })
  } else {
    spinner.succeed('Done!')
    console.log(result)
  }
}

export default packageInfo
