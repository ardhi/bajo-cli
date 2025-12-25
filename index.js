import _path from 'path'

/**
 * Plugin factory
 *
 * @param {string} pkgName - NPM package name
 * @returns {class}
 */
async function factory (pkgName) {
  const me = this
  const { isFunction } = this.app.lib._

  /**
   * BajoCli class
   *
   * @class
   */
  class BajoCli extends this.app.baseClass.Base {
    static alias = 'cli'

    constructor () {
      super(pkgName, me.app)
    }

    _run = async (applet, path, ...args) => {
      const { importPkg, importModule } = this.app.bajo
      const { resolvePath } = this.app.lib.aneka
      const { fastGlob } = this.app.lib
      const { camelCase, map, find } = this.app.lib._
      const select = await importPkg('bajoCli:@inquirer/select')
      const dir = `${_path.dirname(applet.file)}/applet`

      const choices = map(await fastGlob(resolvePath(`${dir}/*.js`)), f => {
        const value = camelCase(_path.basename(f.replace(dir + '/', ''), '.js'))
        return { file: f, value }
      })
      if (!path) {
        path = await select({
          message: this.t('Please select a method:'),
          pageSize: 10,
          choices
        })
      }
      const item = find(choices, { value: path })
      if (!item) this.fatal('Unknown method \'%s\'', path)
      const mod = await importModule(item.file)
      return await mod.call(this.app[applet.ns], path, ...args)
    }

    getNpmPkgInfo = async (name) => {
      const { importModule } = this.app.bajo
      const getNpmPkgInfo = await importModule('bajoCli:/cli/lib/get-npm-pkg-info.js')
      return await getNpmPkgInfo(name)
    }

    getOutputFormat = () => {
      const { without, map } = this.app.lib._
      const exts = map(without(this.app.getConfigFormats(), '.js'), ext => ext.slice(1))
      exts.unshift('pretty')
      const format = this.app.bajo.config.format ?? 'pretty'
      if (!exts.includes(format)) this.fatal('invalid%s%s', 'format', format)
      return format
    }

    hTable = async (...args) => {
      const { importModule } = this.app.bajo
      const { horizontal } = await importModule('bajoCli:/cli/lib/create-table.js')
      return horizontal(...args)
    }

    prettyPrint = async (obj, print = false, titleFn) => {
      const { importModule } = this.app.bajo
      const { horizontal, vertical } = await importModule('bajoCli:/cli/lib/create-table.js', { asDefaultImport: false })
      const { isString, isNumber, isArray } = this.app.lib._
      let result
      if (isString(obj) || isNumber(obj)) result = horizontal([{ obj }], { print, noHeader: true, titleFn })
      else if (isArray(obj)) result = horizontal(obj, { print, titleFn })
      else result = vertical(obj, { print, titleFn })
      if (!print) return result
    }

    runApplet = async (applet, path, ...args) => {
      const { importModule } = this.app.bajo
      const mod = await importModule(applet.file)
      if (mod === 'default') return await this._run(applet, path, ...args)
      const handler = mod.handler ?? mod
      return await handler.call(this.app[applet.ns], path, ...args)
    }

    vTable = async (...args) => {
      const { importModule } = this.app.bajo
      const { vertical } = await importModule('bajoCli:/cli/lib/create-table.js')
      return vertical(...args)
    }

    writeOutput = async (content, path, terminate) => {
      const replacer = (k, v) => {
        if (isFunction(v) || ['app', 'plugin'].includes(k)) return undefined
        return v
      }

      const { saveAsDownload, importPkg } = this.app.bajo
      const { cloneDeep, find } = this.app.lib._
      content = JSON.parse(JSON.stringify(content, replacer))
      const stripAnsi = await importPkg('bajoCli:strip-ansi')
      const format = this.getOutputFormat()
      let result = cloneDeep(content)
      if (format === 'pretty') result = await this.prettyPrint(result)
      else {
        const writer = find(this.app.configHandlers, { ext: `.${format}` })
        result = await writer.writeHandler(result, true)
      }
      if (this.app.bajo.config.save) {
        const file = `/${path}.${format === 'pretty' ? '.txt' : format}`
        await saveAsDownload(file, stripAnsi(result))
      } else console.log(result)
      if (terminate) this.app.exit(true)
    }
  }

  return BajoCli
}

export default factory
