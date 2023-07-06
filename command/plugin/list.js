import isValidPlugin from 'bajo/boot/helper/is-valid-plugin.js'
import fastGlob from 'fast-glob'
import _ from 'lodash'
import getGlobalModuleDir from 'bajo/boot/helper/get-global-module-dir.js'
import epilog from '../../lib/epilog.js'
import listPackages from '../../lib/list-packages.js'

const list = {
  command: 'list',
  aliases: ['l'],
  describe: 'List all installed plugins',
  builder (yargs) {
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const nodeModules = getGlobalModuleDir(null, false)
    const pattern = `${nodeModules}/**/*/bajo`
    let files = await fastGlob(pattern, { onlyDirectories: true })
    files = _.map(_.filter(files, f => {
      f = _.dropRight(f.split('/'), 1).join('/')
      return isValidPlugin(f)
    }), f => _.dropRight(f.split('/'), 1).join('/'))
    listPackages(files, { emptyFiles: `No plugin installed yet` })
  }
}

export default list
