import { spawn } from 'child_process'
import epilog from '../../lib/epilog.js'
import getCwdPkg from '../../lib/get-cwd-pkg.js'
import { has } from 'lodash-es'
import ora from 'ora'
import { __ } from '../../lib/translate.js'

import util from 'util'
import _terminate from 'terminate'
import * as option from '../../lib/option.js'
const { applet, globalScope, posArgs, posName, spawn: spawnOpt } = option

const terminate = util.promisify(_terminate)

/**
 * Command definition object for running a named application.
 *
 * @memberof module:CLI/Command/App
 * @type {TCommand}
 */
const run = {
  command: __('%s <%s> [%s...]', 'run', 'name', 'args'),
  aliases: ['r'],
  describe: __('Run named app'),
  builder (yargs) {
    posName(yargs, 'App name')
    posArgs(yargs)
    globalScope(yargs)
    applet(yargs)
    spawnOpt(yargs)
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const { cwd, pkg } = await getCwdPkg({ argv, type: 'app' })
    if (has(argv, 'applet')) argv.spawn = false
    if (argv.spawn) {
      const params = process.argv.slice(process.argv[2] === 'run' ? 4 : 5)
      params.unshift(`${cwd}/${pkg.main}`)
      params.push(`--cwd=${cwd}`)
      const spinner = ora(__('Spawning %s...', pkg.name)).start()
      const child = spawn('node', params)
      spinner.succeed(__('\'%s\' spawned, pid: %s', pkg.name, child.pid))
      child.stdout.on('data', d => {
        process.stdout.write(d.toString())
      })
      child.stderr.on('data', d => {
        process.stdout.write(d.toString())
      })
      for (const s of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
        process.on(s, async () => {
          let text = __('%s terminated', pkg.name)
          try {
            await terminate(child.pid, s)
          } catch (err) {
            text += ` with error: ${err.message}`
          }
          ora(text).succeed()
        })
      }
    } else {
      process.argv = process.argv.slice(process.argv[2] === 'run' ? 2 : 3)
      const bajo = await import(`${cwd}/node_modules/bajo/index.js`)
      await bajo.default({ cwd })
    }
  }
}

export default run
