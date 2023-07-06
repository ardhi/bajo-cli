import epilog from '../../lib/epilog.js'
import { vertical } from '../../lib/create-table.js'
import _ from 'lodash'
import getCwdPkg from '../../lib/get-cwd-pkg.js'

const info = {
  command: 'info [name]',
  aliases: ['i'],
  describe: 'Show infos. Omit [name] for current dir',
  builder (yargs) {
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const { pkg } = getCwdPkg({ argv, type: 'plugin' })
    vertical(_.pick(pkg, ['name', 'version', 'description', 'author', 'license', 'homepage']))
  }
}

export default info
