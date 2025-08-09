import fastGlob from 'fast-glob'
import getGlobalModuleDir from '../../lib/get-global-module-dir.js'
import epilog from '../../lib/epilog.js'
import listPackages from '../../lib/list-packages.js'
import resolvePath from '../../lib/resolve-path.js'
import isValidApp from '../../lib/is-valid-app.js'
import { fatal, __, print } from '../../lib/translate.js'
import isEmpty from 'lodash-es/isEmpty.js'
import ora from 'ora'
import semver from 'semver'
import select from '@inquirer/select'
import { addDependency } from 'nypm'

const upgrade = {
  command: 'upgrade',
  aliases: ['u'],
  describe: __('Upgrade all plugins to the latest version'),
  builder (yargs) {
    yargs.option('global', {
      describe: __('Global plugins'),
      default: false,
      type: 'boolean'
    })
    yargs.option('registry', {
      describe: __('Custom NPM registry, if any'),
      default: false,
      type: 'string'
    })
    yargs.epilog(epilog)
  },
  async handler (argv) {
    let files = []
    if (argv.global) {
      const nodeModules = getGlobalModuleDir(null, false)
      const pattern = `${nodeModules}/**/*/package.json`
      files = await fastGlob(pattern)
    } else {
      const cwd = resolvePath(process.cwd())
      const name = __('Current directory')
      if (!isValidApp(cwd)) fatal('%s is NOT a valid bajo %s, sorry!', name, 'app')
      const pattern = `${cwd}/node_modules/**/*/package.json`
      files = await fastGlob(pattern)
    }
    if (files.length === 0) fatal('No %ss detected!', 'plugin')
    argv.onlyUnmatch = true
    argv.npmVersion = true
    const coll = await listPackages(files, 'plugin', argv)
    print('Following plugin(s) will be upgraded to the latest versions:')
    const upgradable = []
    for (const c of coll) {
      if (semver.valid(c.npmVersion) && semver.gt(c.npmVersion, c.version)) {
        ora(__('%s: %s -> %s, %s', c.name, c.version, c.npmVersion, 'OK')).succeed()
        upgradable.push(c)
      } else ora(__('%s: %s -> %s, %s', c.name, c.version, isEmpty(c.npmVersion) ? '???' : c.npmVersion, 'SKIP')).fail()
    }
    if (upgradable.length === 0) fatal('No upgradeable package found, sorry')
    const answer = await select({
      message: __('Continue to upgrade %d package(s)?', upgradable.length),
      choices: [
        { value: 'y', name: __('Yes, continue') },
        { value: 'n', name: __('No, abort') }
      ]
    })
    if (answer === 'n') fatal('Aborted')
    const opts = {
      global: argv.global
    }
    for (const u of upgradable) {
      await addDependency(`${u.name}@${u.npmVersion}`, opts)
    }
    print('All done!')
  }
}

export default upgrade
