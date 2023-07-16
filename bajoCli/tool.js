import Path from 'path'

async function tool ({ path, args = [] }) {
  const { print, importPkg, pathResolve, __ } = this.bajo.helper
  const [_, fg, prompts] = await importPkg('lodash::bajo', 'fast-glob::bajo',
    '@inquirer/prompts::bajo-cli')
  const { select } = prompts

  const choices = _.map(await fg(pathResolve(`${__(import.meta).dir}/tool/*.js`)), f => {
    return { file: f, value: _.camelCase(Path.basename(f, '.js')) }
  })
  if (!path) {
    path = await select({
      message: print.__(`Please select a method:`),
      pageSize: 10,
      choices
    })
  }
  const tool = _.find(choices, { value: path })
  if (!tool) print.fatal(`Unknown method '%s'`, path)
  const mod = await import(pathResolve(tool.file, true))
  await mod.default.call(this, path, args)
}

export default tool
