import fastGlob from 'fast-glob'
import getGlobalModuleDir from '../../lib/get-global-module-dir.js'
import epilog from '../../lib/epilog.js'
import listPackages from '../../lib/list-packages.js'
import { __ } from '../../lib/translate.js'

const list = {
  command: 'list',
  aliases: ['l'],
  describe: __('List all installed plugins'),
  builder (yargs) {
    yargs.option('npm-version', {
      describe: __('Check last version on NPM'),
      default: false,
      type: 'boolean'
    })
    yargs.option('registry', {
      describe: __('Custom NPM registry, if any'),
      default: false,
      type: 'string'
    })
    yargs.option('only-unmatch', {
      describe: __('Only unmatch versions'),
      default: false,
      type: 'boolean'
    })
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const nodeModules = getGlobalModuleDir(null, false)
    const pattern = `${nodeModules}/**/*/package.json`
    const files = await fastGlob(pattern)
    await listPackages(files, 'plugin', argv)
  }
}

export default list
