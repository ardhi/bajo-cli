import buildCliSubcommand from '../lib/build-sub-command.js'
import { commands } from './plugin/index.js'
import { __ } from '../lib/translate.js'
import {} from 'lodash-es'

/**
 * Command definition object for managing plugins.
 *
 * @memberof module:CLI/Command
 * @type {TCommand}
 */
const plugin = buildCliSubcommand({
  command: __('%s <%s>', 'plugin', 'action'),
  aliases: ['p'],
  describe: __('Plugins manager'),
  commands
})

export default plugin
