function getOutputFormat () {
  const { get } = this.app.bajo.lib._
  const format = get(this, 'app.bajo.config.format')
  const exts = ['json']
  if (this.app.bajoConfig) exts.push('yml', 'yaml', 'toml')
  if (format && !exts.includes(format)) this.print.fatal('Invalid format \'%s\'', format)
  return format
}

export default getOutputFormat
