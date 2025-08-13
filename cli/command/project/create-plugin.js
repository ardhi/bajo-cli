import {} from 'lodash-es'
import dirNameCheck from './lib/dir-name-check.js'
import interactive from './create-plugin/interactive.js'
import withTpl from './create-plugin/with-tpl.js'
import epilog from '../../lib/epilog.js'
import { __ } from '../../lib/translate.js'

const createPlugin = {
  command: __('%s <%s> [%s]', 'create-plugin', 'name', 'tpl'),
  aliases: ['cp'],
  describe: __('Create plugin project'),
  builder (yargs) {
    yargs.positional('name', {
      describe: __('Any valid npm name'),
      type: 'string'
    })
    yargs.positional('tpl', {
      describe: __('Template to use. Leave blank for interactive mode'),
      type: 'string'
    })
    yargs.option('use-cwd', {
      describe: __('Use current working directory'),
      alias: 'd',
      type: 'boolean'
    })
    yargs.option('interactive', {
      describe: __('Always in interactive mode'),
      alias: 'i',
      type: 'boolean'
    })
    yargs.option('check-npm', {
      describe: __('Check npm for name availability'),
      alias: 'c',
      type: 'boolean'
    })
    yargs.option('registry', {
      describe: __('Custom registry, will enable check-npm if set'),
      alias: 'r',
      type: 'string'
    })
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const cwd = await dirNameCheck(argv)
    const type = 'plugin'
    const session = {}
    if (argv.interactive) await interactive({ argv, cwd, type, session })
    else if (argv.tpl) await withTpl({ argv, cwd, type })
    else await interactive({ argv, cwd, type, session })
  }
}

export default createPlugin
