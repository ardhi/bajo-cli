import isValidApp from 'bajo/boot/helper/is-valid-app.js'
import epilog from '../../lib/epilog.js'
import resolvePath from 'bajo/boot/helper/resolve-path.js'
import ora from 'ora'
import delay from 'delay'
import dirNameCheck from './lib/dir-name-check.js'
import { __ } from '../../lib/translate.js'

const appToPlugin = {
  command: __('%s <%s>', 'app-to-plugin', 'new-name'),
  aliases: ['ap'],
  describe: __('Convert app to plugin'),
  builder (yargs) {
    yargs.positional('new-name', {
      describe: __('New plugin name'),
      type: 'string'
    })
    yargs.option('check-remote', {
      describe: __('Check npm repository for name availability'),
      type: 'boolean'
    })
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const fromDir = resolvePath(process.cwd())
    const spinner = ora(__('Check if current directory is a valid bajo app')).start()
    await delay(1000)
    if (!isValidApp(fromDir)) {
      spinner.text = __('Current directory is NOT a valid bajo app')
      spinner.fail()
      process.exit(1)
    }
    spinner.succeed()
    await dirNameCheck({ name: argv.newName }, `${fromDir}/..`)
  }
}

export default appToPlugin
