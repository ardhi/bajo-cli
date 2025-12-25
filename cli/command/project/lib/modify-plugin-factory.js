import { camelCase, upperFirst, kebabCase } from 'lodash-es'
import fs from 'fs-extra'

async function modifyPluginFactory ({ cwd, argv }) {
  const file = `${cwd}/index.js`
  let content = fs.readFileSync(file, 'utf8')
  content = content.replaceAll('{name}', upperFirst(camelCase(argv.name)))
    .replaceAll('{alias}', kebabCase(argv.name))
  fs.writeFileSync(file, content, 'utf8')
}

export default modifyPluginFactory
