import buildCliSubcommand from '../lib/build-sub-command.js'
import runFn from './app/run.js'
import _ from 'lodash'

const { builder, handler } = runFn

const run = buildCliSubcommand({
  command: 'run <name> [args...]',
  aliases: ['r'],
  describe: `Shortcut for 'bajo app run'`,
  builder,
  handler
})

export default run
