import epilog from '../../lib/epilog.js'
import { vertical } from '../../lib/create-table.js'
import { getRemotePkg } from '../../lib/get-pkg.js'
import { __ } from '../../lib/translate.js'
import { pick } from 'lodash-es'
import ora from 'ora'
import { registry } from '../../lib/option.js'

const info = {
  command: __('%s <%s>', 'pkg', 'name'),
  describe: __('Show detailed remote package info'),
  builder (yargs) {
    yargs.positional('name', {
      describe: __('Package name'),
      type: 'string'
    })
    registry(yargs)
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const spinner = ora(__('Getting info...')).start()
    const info = await getRemotePkg(argv, null, true)
    if (!info) spinner.fail('Not found!')
    spinner.stop()
    vertical(pick(info, ['name', 'version', 'description', 'main', 'type', 'license', 'modified']))
  }
}

export default info
