import fastGlob from 'fast-glob'
import fs from 'fs-extra'
import path from 'path'
import ora from 'ora'
import delay from 'delay'
import resolvePath from 'aneka/src/resolve-path.js'
import { __ } from '../../../lib/translate.js'
import { kebabCase, camelCase, upperFirst } from 'lodash-es'

async function copyMain ({ cwd, argv }) {
  const spinner = ora(__('Copy main plugin')).start()
  await delay(1000)
  const items = await fastGlob(`${argv.fromDir}/main/*`, { onlyFiles: false })
  for (const item of items) {
    try {
      const base = path.basename(item)
      fs.copySync(item, `${cwd}/${base}`)
    } catch (err) {}
  }
  const file = `${cwd}/index.js`
  if (fs.existsSync(file)) {
    const factory = await import(resolvePath(file, true))
    let content = factory.default.toString()
    content = content.replace('class Main extends', `class ${upperFirst(camelCase(argv.name))} extends`)
      .replace('super(pkgName, me.app)', `super(pkgName, me.app)\n      this.alias = '${kebabCase(argv.name)}'`)
    fs.writeFileSync(file, content, 'utf8')
  }
  spinner.succeed()
}

export default copyMain
