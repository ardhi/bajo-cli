import _path from 'path'

async function run (applet, path, ...args) {
  const { importPkg, resolvePath, importModule } = this.app.bajo
  const { fastGlob } = this.app.bajo.lib
  const { camelCase, map, find } = this.app.bajo.lib._
  const select = await importPkg('bajoCli:@inquirer/select')
  const dir = `${_path.dirname(applet.file)}/applet`

  const choices = map(await fastGlob(resolvePath(`${dir}/*.js`)), f => {
    const value = camelCase(_path.basename(f.replace(dir + '/', ''), '.js'))
    return { file: f, value }
  })
  if (!path) {
    path = await select({
      message: this.print.write('Please select a method:'),
      pageSize: 10,
      choices
    })
  }
  const item = find(choices, { value: path })
  if (!item) this.print.fatal('Unknown method \'%s\'', path)
  const mod = await importModule(item.file)
  return await mod.call(this.app[applet.ns], ...args)
}

async function runApplet (applet, path, ...args) {
  const { importModule } = this.app.bajo
  const mod = await importModule(applet.file)
  if (mod === 'default') return await run.call(this, applet, path, ...args)
  const handler = mod.handler ?? mod
  return await handler.call(this.app[applet.ns], path, ...args)
}

export default runApplet
