import Path from 'path'

async function runToolMethod ({ path, args = [], dir }) {
  const { print, importPkg, pathResolve } = this.bajo.helper
  const { camelCase, map, find } = await importPkg('lodash-es')
  const [fg, prompts] = await importPkg('fast-glob', 'bajo-cli:@inquirer/prompts')
  const { select } = prompts

  const choices = map(await fg(pathResolve(`${dir}/*.js`)), f => {
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
  const mod = await import(pathResolve(tool.file, true))
  await mod.default.call(this, path, args)
}

export default runToolMethod
