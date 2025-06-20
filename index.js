import { vertical, horizontal } from './cli/lib/create-table.js'
import getNpmPkgInfo from './cli/lib/get-npm-pkg-info.js'
import _path from 'path'

async function run (applet, path, ...args) {
  const { importPkg, resolvePath, importModule } = this.app.bajo
  const { fastGlob } = this.lib
  const { camelCase, map, find } = this.lib._
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

async function factory (pkgName) {
  const me = this

  return class BajoCli extends this.lib.BajoPlugin {
    constructor () {
      super(pkgName, me.app)
      this.alias = 'cli'
    }

    getNpmPkgInfo = async (name) => {
      return await getNpmPkgInfo(name)
    }

    getOutputFormat = () => {
      const { get } = this.lib._
      const format = get(this, 'app.bajo.config.format')
      const exts = ['json']
      if (this.app.bajoConfig) exts.push('yml', 'yaml', 'toml')
      if (format && !exts.includes(format)) this.print.fatal('Invalid format \'%s\'', format)
      return format
    }

    hTable = (...args) => {
      return horizontal(...args)
    }

    prettyPrint = async (obj, print = false, titleFn) => {
      const { isString, isNumber, isArray } = this.lib._
      let result
      if (isString(obj) || isNumber(obj)) result = horizontal([{ obj }], { print, noHeader: true, titleFn })
      else if (isArray(obj)) result = horizontal(obj, { print, titleFn })
      else result = vertical(obj, { print, titleFn })
      if (!print) return result
    }

    runApplet = async (applet, path, ...args) => {
      const { importModule } = this.app.bajo
      const mod = await importModule(applet.file)
      if (mod === 'default') return await run.call(this, applet, path, ...args)
      const handler = mod.handler ?? mod
      return await handler.call(this.app[applet.ns], path, ...args)
    }

    vTable = (...args) => {
      return vertical(...args)
    }

    writeOutput = async (content, path, format) => {
      const { saveAsDownload, importPkg } = this.app.bajo
      const { cloneDeep } = this.lib._
      const { prettyPrint } = this.app.bajoCli
      const stripAnsi = await importPkg('bajoCli:strip-ansi')
      let result = cloneDeep(content)
      if (['yml', 'yaml', 'toml'].includes(format) && !this.app.bajoConfig) this.print.fatal('Invalid format \'%s\'', format)
      try {
        switch (format) {
          case 'yml':
          case 'yaml': result = await this.app.bajoConfig.toYaml(result, true); break
          case 'toml': result = await this.app.bajoConfig.toToml(result, true); break
          case 'json':
            if (this.app.bajoConfig) result = await this.app.bajoConfig.toJson(result, true)
            else result = JSON.stringify(result, null, 2)
            break
          default:
            result = await prettyPrint(result)
        }
      } catch (err) {
        this.print.fatal('Error: %s', err.message)
      }
      if (this.app.bajo.config.save) {
        const file = `/${path}.${format ?? 'txt'}`
        await saveAsDownload(file, stripAnsi(result))
      } else console.log(result)
    }
  }
}

export default factory
