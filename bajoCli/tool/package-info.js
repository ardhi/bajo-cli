import getNpmPkgInfo from '../../bajo/helper/get-npm-pkg-info.js'
import { input } from '@inquirer/prompts'

async function packageInfo (path, args) {
  const { getConfig, importPackage, saveAsDownload, print } = this.bajo.helper
  const { prettyPrint } = this.bajoCli.helper
  const [_, stripAnsi] = await importPackage('lodash::bajo', 'strip-ansi::bajo-cli')
  let [pkg] = args
  if (_.isEmpty(pkg)) {
    pkg = await input({
      message: 'Package name:',
      validate: (item) => !_.isEmpty(item)
    })
  }
  if (!pkg) print.fatal('You must provide a package name')
  const config = getConfig()
  const resp = await getNpmPkgInfo(pkg)
  if (resp.status === 404) print.fatal(`Unknown package '${pkg}'. Aborted!`)
  if (resp.status !== 200) print.fatal(`Can't check '${pkg}' against npm registry. Aborted!`)
  const omitted = config.full ? [] : ['readme', 'versions']
  let result = _.omit(await resp.json(), omitted)
  result = config.pretty ? (await prettyPrint(result)) : JSON.stringify(result, null, 2)
  if (config.save) {
    const file = `/${path}.${config.pretty ? 'txt' : 'json'}`
    const fullPath = await saveAsDownload(file, stripAnsi(result), 'bajoCli')
    print.ora(`Saved as '${fullPath}'`, true).succeed()
  } else console.log(result)
}

export default packageInfo
