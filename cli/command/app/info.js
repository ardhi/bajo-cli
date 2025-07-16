import epilog from '../../lib/epilog.js'
import { pick } from 'lodash-es'
import { vertical } from '../../lib/create-table.js'
import getCwdPkg from '../../lib/get-cwd-pkg.js'
import { __ } from '../../lib/translate.js'

const info = {
  command: __('%s <%s>', 'info', 'name'),
  aliases: ['i'],
  describe: __('Show detailed infos'),
  builder (yargs) {
    yargs.positional('name', {
      describe: __('App name. Use \'.\' for local app'),
      type: 'string'
    })
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const { pkg } = await getCwdPkg({ argv, type: 'app' })
    const picked = ['name', 'version', 'description', 'author', 'license', 'homepage', 'directory']
    if (argv.npmLastVersion) picked.splice(2, 0, 'npmVersion')
    vertical(pick(pkg, picked))
  }
}

export default info
