import buildCliSubcommand from '../lib/build-sub-command.js'
import { __ } from '../lib/translate.js'
import { commands } from './app/index.js'
import _ from 'lodash'

export const usage = 'Bajo app is a regular npm package with custom structure you can install globaly ' +
  `through 'npm install -g <name>'. You can allow them to run later with a terminal by typing: ` +
  `'bajo app run <name>'. For local bajo apps (packages not globaly installed yet, e.g. your current project), ` +
  `you still can boot it up with this bajo executable by 'chdir' to your bajo project folder ` +
  `and type: 'bajo app run'. This time without providing its name.`

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
