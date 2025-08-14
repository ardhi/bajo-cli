import isValidApp from '../../lib/is-valid-app.js'
import epilog from '../../lib/epilog.js'
import resolvePath from '../../lib/resolve-path.js'
import interactive from './app-to-plugin/interactive.js'
import readJson from '../../lib/read-json.js'
import ora from 'ora'
import delay from 'delay'
import dirNameCheck from './lib/dir-name-check.js'
import { pick } from 'lodash-es'
import { __ } from '../../lib/translate.js'
import { checkNpmName, posName, registry } from '../../lib/option.js'

const appToPlugin = {
  command: __('%s <%s>', 'app-to-plugin', 'name'),
  aliases: ['ap'],
  describe: __('Convert app to plugin'),
  builder (yargs) {
    posName(yargs, 'New plugin name')
    checkNpmName(yargs)
    registry(yargs, 'Custom registry, will enable check-npm if set')
    yargs.epilog(epilog)
  },
  async handler (argv) {
    argv.fromDir = resolvePath(process.cwd())
    const spinner = ora(__('Check if current directory is a valid bajo app')).start()
    await delay(1000)
    if (!isValidApp(argv.fromDir)) {
      spinner.text = __('Current directory is NOT a valid bajo app')
      spinner.fail()
      process.kill(process.pid, 'SIGINT')
      return
    }
    spinner.stop()
    argv.name = argv.newName
    const cwd = await dirNameCheck(argv, `${argv.fromDir}/..`)
    const type = 'plugin'
    const pkg = readJson(`${argv.fromDir}/package.json`)
    const session = {
      pkg: pick(pkg, ['author', 'license'])
    }
    await interactive({ argv, cwd, type, session })
  }
}

export default appToPlugin
