import buildCliSubcommand from '../lib/build-sub-command.js'
import { commands } from './plugin/index.js'
import { __ } from '../lib/translate.js'
import {} from 'lodash-es'

const plugin = buildCliSubcommand({
  command: __('%s <%s>', 'plugin', 'action'),
  aliases: ['p'],
  describe: __('Plugins manager'),
  commands
})

export default plugin
