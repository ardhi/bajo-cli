import _ from 'lodash'
import epilog from './epilog.js'

function buildSubCommand ({ command, aliases, describe, commands, builder, handler, example }) {
  if (!handler) {
    handler = async function (argv) {
      const cmds = _.map(commands, c => {
        return `'${c.command.split(' ')[0]}'`
      })
      if (!cmds.includes(argv.action))
        console.error(`Invalid action '${argv.action}'. Please only use one of these: ${cmds.join(', ')}`)
    }
  }
  if (!builder) {
    builder = function (yargs) {
      if (commands) _.map(commands, cmd => {
        yargs.command(cmd)
      })
      yargs.epilog(epilog)
      if (example) yargs.example(example)
    }
  }
  const item = {
    command,
    aliases,
    describe,
    builder,
    handler
  }
  return item
}

export default buildSubCommand
