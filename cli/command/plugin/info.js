import epilog from '../../lib/epilog.js'
import { vertical } from '../../lib/create-table.js'
import { pick, isEmpty } from 'lodash-es'
import getCwdPkg from '../../lib/get-cwd-pkg.js'
import { __ } from '../../lib/translate.js'
import { globalScope, npmVersion, posName, registry, remote } from '../../lib/option.js'

const info = {
  command: __('%s <%s>', 'info', 'name'),
  aliases: ['i'],
  describe: __('Show detailed infos'),
  builder (yargs) {
    posName(yargs, 'Plugin name')
    globalScope(yargs)
    remote(yargs)
    npmVersion(yargs)
    registry(yargs)
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
