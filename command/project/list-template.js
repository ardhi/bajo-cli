import listTpl from './tpl/list-tpl.js'
import path from 'path'
import fs from 'fs-extra'
import epilog from '../../lib/epilog.js'
import { horizontal } from '../../lib/create-table.js'

const listTemplate = {
  command: 'list-template <type>',
  aliases: ['lt'],
  describe: `List project templates`,
  builder (yargs) {
    yargs.positional('type', {
      describe: 'Template type',
      choices: ['app', 'plugin'],
      type: 'string'
    })
    yargs.epilog(epilog)
  },
  async handler (argv) {
    const dirs = await listTpl(argv.type)
    if (dirs.length === 0) return
    const coll = []
    for (const d of dirs) {
      const name = path.basename(d)
      let info
      try {
        info = fs.readFileSync(`${d}/info.txt`, 'utf8')
      } catch (err) {}
      coll.push({ Name: name, Description: info })
    }
    horizontal(coll)
  }
}

export default listTemplate
