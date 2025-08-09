import epilog from '../../lib/epilog.js'
import { vertical } from '../../lib/create-table.js'
import { pick, isEmpty } from 'lodash-es'
import getCwdPkg from '../../lib/get-cwd-pkg.js'
import { __ } from '../../lib/translate.js'

const info = {
  command: __('%s <%s>', 'info', 'name'),
  aliases: ['i'],
  describe: __('Show detailed infos'),
  builder (yargs) {
    yargs.positional('name', {
      describe: __('Plugin name'),
      type: 'string'
    })
    yargs.option('global', {
      describe: __('Global plugins'),
      default: false,
      type: 'boolean'
    })
    yargs.option('remote', {
      describe: __('Force get remote package'),
      default: false,
      type: 'boolean'
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
    const parts = argv.name.split('@')
    argv.name = isEmpty(parts[0]) ? `@${parts[1]}` : parts[0]
    const { pkg } = await getCwdPkg({ argv, type: 'plugin' })
    const picked = ['name', 'version', 'description', 'author', 'license', 'homepage', 'directory']
    if (argv.npmVersion) picked.splice(2, 0, 'npmVersion', 'versionMatch')
    vertical(pick(pkg, picked))
  }
}

export default info
