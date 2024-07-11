import Path from 'path'
import os from 'os'
import net from 'net'

async function runToolMethod ({ path, args = [], dir, options = {} } = {}) {
  const { fastGlob, print, importPkg, resolvePath, getConfig, generateId } = this.bajo
  const { camelCase, map, find } = this.bajo.lib._
  const select = await importPkg('bajoCli:@inquirer/select')
  const config = getConfig()

  const choices = map(await fastGlob(resolvePath(`${dir}/**/*.js`)), f => {
    const base = f.replace(dir + '/', '').slice(0, -3)
    return { file: f, value: camelCase(base) }
  })
  if (!path) {
    path = await select({
      message: print.__('Please select a method:'),
      pageSize: 10,
      choices
    })
  }
  const tool = find(choices, { value: path })
  if (!tool) print.fatal('Unknown method \'%s\'', path)
  const mod = await import(resolvePath(tool.file, true))
  await mod.default.call(this, { path, args, options })
  if (!config.tool) return
  if (options.demonize === '*' || (options.demonize ?? []).includes(path)) {
    this.log.debug('Tool \'%s\' demonized', path)
    this.bajoCli.dsocket = os.platform() === 'win32' ? Path.join('\\\\?\\pipe', Path.resolve(config.dir.tmp), 'bajoDb', generateId()) : path.join(config.dir.tmp, 'bajoDb', generateId())
    this.bajoCli.daemon = net.createServer()
    this.bajoCli.daemon.listen(this.bajoCli.dsocket)
  } else {
    process.kill(process.pid, 'SIGINT')
  }
}

export default runToolMethod
