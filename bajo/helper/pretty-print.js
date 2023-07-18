import { horizontal, vertical } from '../../cli/lib/create-table.js'

async function prettyPrint (obj, print = false, titleFn) {
  const { importPkg } = this.bajo.helper
  const { isString, isNumber, isArray } = await importPkg('lodash-es')
  let result
  if (isString(obj) || isNumber(obj)) result = horizontal([{ obj }], { print, noHeader: true, titleFn })
  else if (isArray(obj)) result = horizontal(obj, { print, titleFn })
  else result = vertical(obj, { print, titleFn })
  if (!print) return result
}

export default prettyPrint
