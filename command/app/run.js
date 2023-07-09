import { spawn } from 'child_process'
import terminate from 'terminate/promise.js'
import epilog from '../../lib/epilog.js'
import getCwdPkg from '../../lib/get-cwd-pkg.js'
import boot from 'bajo/boot/index.js'
import _ from 'lodash'
import ora from 'ora'

const run = {
  command: 'run <name> [args...]',
  aliases: ['r'],
  describe: `Run named app`,
  builder (yargs) {
    yargs.positional('name', {
      describe: `App name. Use '.' for local app`,
      type: 'string'
    })
    yargs.positional('args', {
      describe: 'Optional one or more arguments'
    })
    yargs.option('tool', {
      describe: 'Run side tool (if any) instead of main program',
      alias: 't',
      type: 'string'
    })
    yargs.option('spawn', {
      describe: 'Spawn app as child process',
      default: true,
      type: 'boolean'
    })
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const { cwd, pkg } = getCwdPkg({ argv, type: 'app' })
    if (_.has(argv, 'tool')) argv.spawn = false
    if (argv.spawn) {
      const params = process.argv.slice(process.argv[2] === 'run' ? 4 : 5)
      params.unshift(`--spawn=${argv.spawn}`)
      params.unshift(`${cwd}/${pkg.main}`)
      params.push(`--cwd=${cwd}`)
      const spinner = ora(`Spawning ${pkg.name}...`).start()
      const child = spawn('node', params)
      spinner.succeed(`'${pkg.name}' spawned, pid: ${child.pid}`)
      child.stdout.on('data', d => {
        process.stdout.write(d.toString())
      })
      child.stderr.on('data', d => {
        process.stdout.write(d.toString())
      })
      for (const s of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
        process.on(s, async () => {
          let text = `${pkg.name} terminated`
          try {
            await terminate(child.pid, s)
          } catch (err) {
            // text += ` with error: ${err.message}`
          }
          ora(text).succeed()
        })
      }
    } else {
      process.argv = process.argv.slice(process.argv[2] === 'run' ? 2 : 3)
      await boot(cwd)
    }
  }
}

export default run
