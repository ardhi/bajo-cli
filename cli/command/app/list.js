import epilog from '../../lib/epilog.js'
import listPackages from '../../lib/list-packages.js'
import { __ } from '../../lib/translate.js'
import { globalScope } from '../../lib/option.js'
import { horizontal } from '../../lib/create-table.js'
import { getFiles } from '../plugin/list.js'

/**
 * Command definition object for listing all installed applications.
 *
 * @memberof module:CLI/Command/App
 * @type {module:CLI/Command~TCommand}
 */
const list = {
  command: 'list',
  aliases: ['l'],
  describe: __('List all installed applications'),
  builder (yargs) {
    globalScope(yargs)
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const files = await getFiles(argv, 'app', !argv.global)
    const picked = ['base', 'name', 'version', 'npmVersion', 'versionMatch', 'description']
    const coll = await listPackages(files, 'app', argv, picked)
    horizontal(coll)
  }
}

export default list
