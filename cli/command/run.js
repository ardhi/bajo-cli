import buildCliSubcommand from '../lib/build-sub-command.js'
import runFn from './app/run.js'
import _ from 'lodash'
import { __ } from '../lib/translate.js'

const { builder, handler } = runFn

const run = buildCliSubcommand({
  command: __('%s <%s> [%s...]', 'run', 'name', 'args'),
  aliases: ['r'],
  describe: __(`Shortcut for 'bajo app run'`),
  builder,
  handler,
  epilog: false
})

export default run
