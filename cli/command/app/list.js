import isValidApp from 'bajo/boot/method/is-valid-app.js'
import getGlobalModuleDir from 'bajo/boot/method/get-global-module-dir.js'
import fastGlob from 'fast-glob'
import epilog from '../../lib/epilog.js'
import listPackages from '../../lib/list-packages.js'
import { __ } from '../../lib/translate.js'
import { map, dropRight, filter } from 'lodash-es'

const list = {
  command: 'list',
  aliases: ['l'],
  describe: __('List all installed applications'),
  builder (yargs) {
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const nodeModules = getGlobalModuleDir(null, false)
    const pattern = `${nodeModules}/**/*/app/bajo`
    let files = await fastGlob(pattern, { onlyDirectories: true })
    files = map(filter(files, f => {
      f = dropRight(f.split('/'), 2).join('/')
      return isValidApp(f)
    }), f => dropRight(f.split('/'), 2).join('/'))
    listPackages(files, { emptyFiles: __('No app installed yet') })
  }
}

export default list
