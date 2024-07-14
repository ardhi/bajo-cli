async function writeOutput (content, path, format) {
  const { saveAsDownload, importPkg } = this.app.bajo
  const { cloneDeep } = this.app.bajo.lib._
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

export default writeOutput
