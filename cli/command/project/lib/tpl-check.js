import path from 'path'
import ora from 'ora'
import listTpl from '../tpl/list-tpl.js'
import { __ } from '../../../lib/translate.js'

async function tplCheck ({ type, argv }) {
  const dirs = await listTpl(type)
  let tplDir
  for (const d of dirs) {
    if (path.basename(d) === argv.tpl) {
      tplDir = d
      break
    }
  }
  if (!tplDir) {
    ora(__(`Unknown app template '%s'. Type: 'bajo project tpl %s' for valid templates`), argv.tpl, type).fail()
    process.exit()
  }
  return tplDir
}

export default tplCheck
