import _ from 'lodash'
import Epilog from './epilog.js'

function buildSubCommand ({ command, aliases, describe, commands, builder, handler, example, epilog = true } = {}) {
  if (!handler) {
    handler = async function (argv) {
      const cmds = _.map(commands, c => {
        return `'${c.command.split(' ')[0]}'`
      })
      if (!cmds.includes(argv.action))
        console.error(`Invalid action '${argv.action}'. Please only use one of these: ${cmds.join(', ')}`)
    }
  }
  const extBuilder = function (yargs) {
    if (builder) builder(yargs)
    if (commands) _.map(commands, cmd => {
      yargs.command(cmd)
    })
    if (epilog !== false) yargs.epilog(Epilog)
    if (example) yargs.example(example)
  }
  const item = {
    command,
    aliases,
    describe,
    builder: extBuilder,
    handler
  }
  return item
}

export default buildSubCommand
