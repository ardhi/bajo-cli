import {} from 'lodash-es'
import dirNameCheck from './lib/dir-name-check.js'
import interactive from './create-plugin/interactive.js'
import withTpl from './create-plugin/with-tpl.js'
import epilog from '../../lib/epilog.js'
import { __ } from '../../lib/translate.js'
import { checkNpmName, interactiveMode, posName, posTpl, registry, useCwd } from '../../lib/option.js'

const createPlugin = {
  command: __('%s <%s> [%s]', 'create-plugin', 'name', 'tpl'),
  aliases: ['cp'],
  describe: __('Create plugin project'),
  builder (yargs) {
    posName(yargs, 'Any valid npm name')
    posTpl(yargs)
    useCwd(yargs)
    interactiveMode(yargs)
    checkNpmName(yargs)
    registry(yargs, 'Custom registry, will enable check-npm if set')
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
