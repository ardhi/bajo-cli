import buildCliSubcommand from '../lib/build-sub-command.js'
import { __ } from '../lib/translate.js'
import { commands } from './project/index.js'
import {} from 'lodash-es'

export const usage = '...'

const project = buildCliSubcommand({
  command: __('%s <%s>', 'project', 'action'),
  aliases: ['p'],
  describe: __('Project builder'),
  commands
})

export default project
