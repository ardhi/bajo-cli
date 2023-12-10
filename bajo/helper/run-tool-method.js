import Path from 'path'
import os from 'os'
import net from 'net'

async function runToolMethod ({ path, args = [], dir, options = {}, returnEarly } = {}) {
  const { print, importPkg, resolvePath, getConfig, generateId, log } = this.bajo.helper
  const { camelCase, map, find } = await importPkg('lodash-es')
  const [fg, select] = await importPkg('fast-glob', 'bajo-cli:@inquirer/select')
  const config = getConfig()

  const choices = map(await fg(resolvePath(`${dir}/*.js`)), f => {
    return { file: f, value: camelCase(Path.basename(f, '.js')) }
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
  await mod.default.call(this, { path, args, options, returnEarly })
  if (returnEarly) return
  if (options.demonize === '*' || (options.demonize ?? []).includes(path)) {
    log.debug('Side tool \'%s\' demonized', path)
    this.bajoCli.dsocket = os.platform() === 'win32' ? Path.join('\\\\?\\pipe', Path.resolve(config.dir.tmp), 'bajoDb', generateId()) : path.join(config.dir.tmp, 'bajoDb', generateId())
    this.bajoCli.daemon = net.createServer()
    this.bajoCli.daemon.listen(this.bajoCli.dsocket)
  } else process.exit(0)
}

export default runToolMethod
