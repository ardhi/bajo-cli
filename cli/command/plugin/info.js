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
    yargs.option('npm-version', {
      describe: __('Check last version on NPM'),
      default: false,
      type: 'boolean'
    })
    yargs.option('registry', {
      describe: __('Custom NPM registry, if any'),
      type: 'string'
    })
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const { pkg } = await getCwdPkg({ argv, type: 'plugin' })
    const picked = ['name', 'version', 'description', 'author', 'license', 'homepage', 'directory']
    if (argv.npmVersion) picked.splice(2, 0, 'npmVersion', 'match')
    vertical(pick(pkg, picked))
  }
}

export default info
