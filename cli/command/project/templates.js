import listTpl from './tpl/list-tpl.js'
import path from 'path'
import fs from 'fs-extra'
import { horizontal } from '../../lib/create-table.js'
import { fatal, __ } from '../../lib/translate.js'
import { posTplType } from '../../lib/option.js'

/**
 * Command definition object for listing project templates.
 *
 * @memberof module:CLI/Command/Project
 * @type {TCommand}
 */
const templates = {
  command: __('%s <%s>', 'templates', 'type'),
  aliases: ['lt'],
  describe: __('List project templates'),
  builder (yargs) {
    posTplType(yargs)
  },
  async handler (argv) {
    const dirs = await listTpl(argv.type)
    if (dirs.length === 0) fatal('No template found, sorry!')
    const coll = []
    for (const d of dirs) {
      const name = path.basename(d)
      let info
      try {
        info = fs.readFileSync(`${d}/info.txt`, 'utf8')
      } catch (err) {}
      const item = {}
      item[__('name')] = name
      item[__('description')] = __(info)
      coll.push(item)
    }
    horizontal(coll)
  }
}

export default templates
