import fastGlob from 'fast-glob'
import getGlobalModuleDir from '../../lib/get-global-module-dir.js'
import epilog from '../../lib/epilog.js'
import listPackages from '../../lib/list-packages.js'
import resolvePath from '../../lib/resolve-path.js'
import isValidApp from '../../lib/is-valid-app.js'
import { fatal, __ } from '../../lib/translate.js'
import { horizontal } from '../../lib/create-table.js'

const list = {
  command: 'list',
  aliases: ['l'],
  describe: __('List all installed plugins'),
  builder (yargs) {
    yargs.option('global', {
      describe: __('Global plugins'),
      default: false,
      type: 'boolean'
    })
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
    let files = []
    if (argv.global) {
      const nodeModules = getGlobalModuleDir(null, false)
      const pattern = `${nodeModules}/**/*/package.json`
      files = await fastGlob(pattern)
    } else {
      const cwd = resolvePath(process.cwd())
      const name = __('Current directory')
      if (!isValidApp(cwd)) fatal('%s is NOT a valid bajo %s, sorry!', name, 'app')
      const pattern = `${cwd}/node_modules/**/*/package.json`
      files = await fastGlob(pattern)
    }
    if (files.length === 0) fatal('No %ss detected!', 'plugin')
    const coll = await listPackages(files, 'plugin', argv)
    horizontal(coll)
  }
}

export default list
