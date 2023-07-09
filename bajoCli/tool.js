import Path from 'path'
import url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

async function tool ({ path, args = [] }) {
  const { print, importPackage, pathResolve } = this.bajo.helper
  const [_, fg, prompts] = await importPackage('lodash::bajo', 'fast-glob::bajo',
    '@inquirer/prompts::bajo-cli')
  const { select } = prompts

  const choices = _.map(await fg(pathResolve(`${__dirname}/tool/*.js`)), f => {
    return { file: f, value: _.camelCase(Path.basename(f, '.js')) }
  })
  if (!path) {
    path = await select({
      message: `Please select a method:`,
      pageSize: 10,
      choices
    })
  }
  const tool = _.find(choices, { value: path })
  if (!tool) print.fatal(`Unsupported methods '${path}'`)
  const mod = await import(pathResolve(tool.file, true))
  await mod.default.call(this, path, args)
}

export default tool
