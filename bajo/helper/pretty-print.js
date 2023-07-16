import { horizontal, vertical } from '../../cli/lib/create-table.js'

async function prettyPrint (obj, print = false) {
  const { importPkg } = this.bajo.helper
  const { isString, isNumber, isArray } = await importPkg('lodash-es::bajo')
  let result
  if (isString(obj) || isNumber(obj)) result = horizontal([{ obj }], { print, noHeader: true })
  else if (isArray(obj)) result = horizontal(obj, { print })
  else result = vertical(obj, { print })
  if (!print) return result
}

export default prettyPrint
