import epilog from '../../lib/epilog.js'
import { dropRight } from 'lodash-es'
import getGlobalPath from 'get-global-path'
import resolvePath from '../../lib/resolve-path.js'
import { __ } from '../../lib/translate.js'

const globalDir = {
  command: __('%s', 'gdir'),
  describe: __('Show npm global directory'),
  builder (yargs) {
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const npmPath = getGlobalPath('npm')
    const dir = dropRight(resolvePath(npmPath).split('/'), 1).join('/')
    console.log(dir)
  }
}

export default globalDir
