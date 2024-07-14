import Path from 'path'
import os from 'os'
import net from 'net'

async function runToolMethod ({ path, args = [], dir, options = {}, ns, alias } = {}) {
  const { importPkg, resolvePath, generateId } = this.app.bajo
  const { fastGlob } = this.app.bajo.lib
  const { camelCase, map, find } = this.app.bajo.lib._
  const select = await importPkg('bajoCli:@inquirer/select')

  const choices = map(await fastGlob(resolvePath(`${dir}/**/*.js`)), f => {
    const base = f.replace(dir + '/', '').slice(0, -3)
    return { file: f, value: camelCase(base) }
  })
  if (!path) {
    path = await select({
      message: this.print.write('Please select a method:'),
      pageSize: 10,
      choices
    })
  }
  const tool = find(choices, { value: path })
  if (!tool) this.print.fatal('Unknown method \'%s\'', path)
  const mod = await import(resolvePath(tool.file, true))
  await mod.default.call(this.app[ns], { path, args, options })
  if (!this.app.bajo.config.tool) return
  if (options.demonize === '*' || (options.demonize ?? []).includes(path)) {
    this.log.debug('Tool \'%s\' is running background...', path)
    this.dsocket = os.platform() === 'win32' ? Path.join('\\\\?\\pipe', Path.resolve(this.app.bajo.config.dir.tmp), this.name, generateId()) : path.join(this.app.bajo.config.dir.tmp, this.name, generateId())
    this.daemon = net.createServer()
    this.daemon.listen(this.bajoCli.dsocket)
  } else {
    process.kill(process.pid, 'SIGINT')
  }
}

export default runToolMethod
