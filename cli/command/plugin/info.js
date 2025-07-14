import epilog from '../../lib/epilog.js'
import { vertical } from '../../lib/create-table.js'
import { pick } from 'lodash-es'
import getCwdPkg from '../../lib/get-cwd-pkg.js'
import { __ } from '../../lib/translate.js'

const info = {
  command: __('%s <%s>', 'info', 'name'),
  aliases: ['i'],
  describe: __('Show detailed infos'),
  builder (yargs) {
    yargs.positional('name', {
      describe: __('Plugin name. Use \'.\' for local plugin'),
      type: 'string'
    })
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const { pkg } = getCwdPkg({ argv, type: 'plugin' })
    vertical(pick(pkg, ['name', 'version', 'description', 'author', 'license', 'homepage', 'directory']))
  }
}

export default info
