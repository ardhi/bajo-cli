import isValidPlugin from 'bajo/boot/class/bajo-core/method/is-valid-plugin.js'
import fastGlob from 'fast-glob'
import { map, dropRight, filter } from 'lodash-es'
import getGlobalModuleDir from 'bajo/boot/class/bajo-core/method/get-global-module-dir.js'
import epilog from '../../lib/epilog.js'
import listPackages from '../../lib/list-packages.js'
import { __ } from '../../lib/translate.js'

const list = {
  command: 'list',
  aliases: ['l'],
  describe: __('List all installed plugins'),
  builder (yargs) {
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const nodeModules = getGlobalModuleDir(null, false)
    const pattern = `${nodeModules}/**/*/bajo`
    let files = await fastGlob(pattern, { onlyDirectories: true })
    files = map(filter(files, f => {
      f = dropRight(f.split('/'), 1).join('/')
      return isValidPlugin(f)
    }), f => dropRight(f.split('/'), 1).join('/'))
    listPackages(files, { emptyFiles: __('No plugin installed yet') })
  }
}

export default list
