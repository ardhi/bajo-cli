import buildCliSubcommand from '../lib/build-sub-command.js'
import { commands } from './misc/index.js'
import { __ } from '../lib/translate.js'
import {} from 'lodash-es'

/**
 * Command definition object for miscellaneous tools.
 *
 * @memberof module:CLI/Command
 * @type {TCommand}
 */
const misc = buildCliSubcommand({
  command: __('%s <%s>', 'misc', 'action'),
  aliases: ['m'],
  describe: __('Misc Tools'),
  commands
})

export default misc
