import { map } from 'lodash-es'
import Epilog from './epilog.js'
import { __, print } from './translate.js'

function buildSubCommand ({ command, aliases, describe, commands, builder, handler, example, epilog = true } = {}) {
  if (!handler) {
    handler = async function (argv) {
      const cmds = map(commands, c => {
        return `'${c.command.split(' ')[0]}'`
      })
      if (!cmds.includes(argv.action)) print(`Invalid action '%s'. Please only use one of these: %s`, argv.action, cmds.join(', '))
    }
  }
  const extBuilder = function (yargs) {
    if (builder) builder(yargs)
    if (commands) map(commands, cmd => {
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
