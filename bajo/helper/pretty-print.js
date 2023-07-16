import { horizontal, vertical } from '../../cli/lib/create-table.js'

async function prettyPrint (obj, print = false) {
  const { importPkg } = this.bajo.helper
  const _ = await importPkg('lodash::bajo')
  let result
  if (_.isString(obj) || _.isNumber(obj)) result = horizontal([{ obj }], { print, noHeader: true })
  else if (_.isArray(obj)) result = horizontal(obj, { print })
  else result = vertical(obj, { print })
  if (!print) return result
}

export default prettyPrint
