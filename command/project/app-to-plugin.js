import isValidApp from 'bajo/boot/helper/is-valid-app.js'
import epilog from '../../lib/epilog.js'
import pathResolve from 'bajo/boot/helper/path-resolve.js'
import ora from 'ora'
import delay from 'delay'
import dirNameCheck from './lib/dir-name-check.js'

const appToPlugin = {
  command: 'app-to-plugin <new-name>',
  aliases: ['ap'],
  describe: `Convert app to plugin`,
  builder (yargs) {
    yargs.positional('new-name', {
      describe: 'New plugin name',
      type: 'string'
    })
    yargs.option('check-remote', {
      describe: 'Check npm repository for package existence',
      type: 'boolean'
    })
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const fromDir = pathResolve(process.cwd())
    const spinner = ora('Check if current directory is a valid bajo app').start()
    await delay(1000)
    if (!isValidApp(fromDir)) {
      spinner.text = 'Current directory is NOT a valid bajo app'
      spinner.fail()
      process.exit(1)
    }
    spinner.succeed()
    const toDir = pathResolve(await dirNameCheck({ name: argv.newName }, `${fromDir}/..`))

  }
}

export default appToPlugin
