import _path from 'path'
import config from './lib/config.js'

/**
 * Plugin factory,
 *
 * **Never** call this function directly!!! It's only-meant to be called by the {@link https://ardhi.github.io/bajo|Bajo framework} during plugin initialization.
 *
 * @param {string} pkgName - NPM package name
 * @returns {BajoCli} - BajoCli class
 */
async function factory (pkgName) {
  const me = this
  const { isFunction } = this.app.lib._

  /**
   * BajoCli class definition.
   *
   * @class
   */
  class BajoCli extends this.app.baseClass.Base {
    /**
     * Constructor
     */
    constructor () {
      super(pkgName, me.app)
      /**
       * Configuration object.
       * @type {BajoCli.TConfig}
       */
      this.config = config
    }

    /**
     * Private method to run a method from an applet.
     *
     * @async
     * @method
     * @private
     * @param {object} applet - Applet object
     * @param {string} path - Path to the method to be executed
     * @param {...any} args - Arguments to be passed to the method
     * @returns {Promise<any>} - Result of the executed method
     * @see {BajoCli#runApplet} for the public method to run an applet
     */
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
          message: this.t('selectMethod'),
          pageSize: 10,
          choices
        })
      }
      const item = find(choices, { value: path })
      if (!item) this.fatal('unknownMethod%s', path)
      const mod = await importModule(item.file)
      return await mod.call(this.app[applet.ns], path, ...args)
    }

    /**
     * Get package information from NPM registry
     *
     * @async
     * @method
     * @param {string} name - Package name
     * @returns {Promise<object>} - Package information
     */
    getNpmPkgInfo = async (name) => {
      const { importModule } = this.app.bajo
      const getNpmPkgInfo = await importModule('bajoCli:/cli/lib/get-npm-pkg-info.js')
      return await getNpmPkgInfo(name)
    }

    /**
     * Get output format from configuration
     *
     * @method
     * @returns {string} - Output format
     */
    getOutputFormat = () => {
      const { without, map } = this.app.lib._
      const exts = map(without(this.app.getConfigFormats(), '.js'), ext => ext.slice(1))
      exts.unshift('pretty')
      const format = this.app.bajo.config.format ?? 'pretty'
      if (!exts.includes(format)) this.fatal('invalid%s%s', 'format', format)
      return format
    }

    /**
     * Draw a horizontal table
     *
     * @async
     * @method
     * @param  {...any} args - Arguments to be passed to the horizontal table
     * @returns {Promise<any>} - Result of the horizontal table
     */
    hTable = async (...args) => {
      const { importModule } = this.app.bajo
      const { horizontal } = await importModule('bajoCli:/cli/lib/create-table.js')
      return horizontal(...args)
    }

    /**
     * Pretty print an object
     *
     * @async
     * @method
     * @param {string|number|Array|Object} obj - Object to be pretty printed
     * @param {boolean} [print=false] - Whether to print the result (if true) or return it (default: false)
     * @param {Function} [titleFn] - Function to generate titles
     * @returns {Promise<string>} - Pretty printed string
     */
    prettyPrint = async (obj, print = false, titleFn) => {
      const { importModule } = this.app.bajo
      const { horizontal, vertical } = await importModule('bajoCli:/cli/lib/create-table.js', { asDefaultImport: false })
      const { isString, isNumber, isArray } = this.app.lib._
      let result
      if (isString(obj) || isNumber(obj)) result = horizontal([{ obj }], { print, noHeader: true, titleFn })
      else if (isArray(obj)) result = horizontal(obj, { print, titleFn })
      else result = vertical(obj, { print, titleFn })
      if (!print) return result
      console.log(result)
    }

    /**
     * Run an applet
     *
     * @async
     * @method
     * @param {object} applet - Applet object
     * @param {string} path - Path to the applet
     * @param {...any} args - Arguments to be passed to the applet
     * @returns {Promise<any>} - Result of the applet
     */
    runApplet = async (applet, path, ...args) => {
      const { importModule } = this.app.bajo
      const mod = await importModule(applet.file)
      if (mod === 'default') return await this._run(applet, path, ...args)
      const handler = mod.handler ?? mod
      return await handler.call(this.app[applet.ns], path, ...args)
    }

    /**
     * Draw a vertical table
     *
     * @async
     * @method
     * @param  {...any} args - Arguments to be passed to the vertical table
     * @returns {Promise<any>} - Result of the vertical table
     */
    vTable = async (...args) => {
      const { importModule } = this.app.bajo
      const { vertical } = await importModule('bajoCli:/cli/lib/create-table.js')
      return vertical(...args)
    }

    /**
     * Write output to a file or console
     *
     * @async
     * @method
     * @param {object|array} content - Object or array to be written
     * @param {string} path - Path to the output file. Ignored if `config.applet.save` is false.
     * @param {boolean} terminate - Whether to terminate the process after writing
     */
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
      if (this.config.applet.save) {
        const file = `/${path}.${format === 'pretty' ? '.txt' : format}`
        await saveAsDownload(file, stripAnsi(result))
      } else console.log(result)
      if (terminate) this.app.exit(true)
    }
  }

  return BajoCli
}

export default factory
