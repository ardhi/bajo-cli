import isValidApp from 'bajo/boot/helper/is-valid-app.js'
import getGlobalModuleDir from 'bajo/boot/helper/get-global-module-dir.js'
import fastGlob from 'fast-glob'
import epilog from '../../lib/epilog.js'
import listPackages from '../../lib/list-packages.js'
import _ from 'lodash'

const list = {
  command: 'list',
  aliases: ['l'],
  describe: 'List all installed applications',
  builder (yargs) {
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const nodeModules = getGlobalModuleDir(null, false)
    const pattern = `${nodeModules}/**/*/app/bajo`
    let files = await fastGlob(pattern, { onlyDirectories: true })
    files = _.map(_.filter(files, f => {
      f = _.dropRight(f.split('/'), 2).join('/')
      return isValidApp(f)
    }), f => _.dropRight(f.split('/'), 2).join('/'))
    listPackages(files, { emptyFiles: `No app installed yet` })
  }
}

export default list
