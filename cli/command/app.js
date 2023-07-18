import buildCliSubcommand from '../lib/build-sub-command.js'
import { __ } from '../lib/translate.js'
import { commands } from './app/index.js'
import {} from 'lodash-es'

const project = buildCliSubcommand({
  command: __('%s <%s>', 'app', 'action'),
  aliases: ['a'],
  describe: __('Apps manager'),
  /*
  builder (yargs) {
    yargs.positional('action', {
      describe: 'Enter your action',
    })
  },
  */
  commands
})

export default project
