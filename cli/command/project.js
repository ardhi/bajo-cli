import buildCliSubcommand from '../lib/build-sub-command.js'
import { __ } from '../lib/translate.js'
import { commands } from './project/index.js'
import {} from 'lodash-es'

export const usage = '...'

/**
 * Command definition object for managing projects.
 *
 * @memberof module:CLI/Command
 * @type {module:CLI/Command~TCommand}
 */
const project = buildCliSubcommand({
  command: __('%s <%s>', 'project', 'action'),
  aliases: ['j'],
  describe: __('Project builder'),
  commands
})

export default project
