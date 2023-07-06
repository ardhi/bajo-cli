import epilog from '../../lib/epilog.js'
import _ from 'lodash'
import { vertical } from '../../lib/create-table.js'
import getCwdPkg from '../../lib/get-cwd-pkg.js'

const info = {
  command: 'info <name>',
  aliases: ['i'],
  describe: `Show detailed infos`,
  builder (yargs) {
    yargs.positional('name', {
      describe: `App name. Use '.' for local app`,
      type: 'string'
    })
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const { pkg } = getCwdPkg({ argv, type: 'app' })
    vertical(_.pick(pkg, ['name', 'version', 'description', 'author', 'license', 'homepage']))
  }
}

export default info
